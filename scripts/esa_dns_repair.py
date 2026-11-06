#!/usr/bin/env python3
"""Remove exactly the verified retired Moyu apex A record before ESA Pages binding.

Safeguards:
- exact ESA site identity, account zone status and NS mode
- exact record ID, hostname, type and old IP
- never mutate test.6260381.xyz or unrelated records
- no DNS mutation if observations differ from the prior read-only audit
"""
import os
import time
from alibabacloud_tea_openapi import models as open_api_models
from alibabacloud_esa20240910.client import Client
from alibabacloud_esa20240910 import models as esa_models

APEX = "6260381.xyz"
SITE_ID = 170397100153036
OLD_RECORD_ID = 180476294977776
OLD_IP = "8.138.2.174"
EXPECTED_NS = {"mount-tai.ns.atrustdns.com", "nasser.ns.atrustdns.com"}

client = Client(open_api_models.Config(
    access_key_id=os.environ["ALIBABA_CLOUD_ACCESS_KEY_ID"],
    access_key_secret=os.environ["ALIBABA_CLOUD_ACCESS_KEY_SECRET"],
    endpoint="esa.cn-hangzhou.aliyuncs.com",
))

sites = client.list_sites(esa_models.ListSitesRequest(
    site_name=APEX, site_search_type="exact", page_number=1, page_size=20
)).body.sites or []
site_matches = [s for s in sites if s.site_name == APEX and s.status == "active" and int(s.site_id) == SITE_ID]
if len(site_matches) != 1:
    raise RuntimeError("ESA site identity/status changed since approved read-only audit. Refusing DNS mutation.")
site = site_matches[0]
found_ns = set((site.name_server_list or "").split(","))
if site.access_type != "NS" or found_ns != EXPECTED_NS:
    raise RuntimeError("ESA DNS access mode or nameservers differ from verified audit. Refusing DNS mutation.")

def exact_apex_records():
    page = 1
    records = []
    while page <= 10:
        body = client.list_records(esa_models.ListRecordsRequest(
            site_id=SITE_ID, record_name=APEX, record_match_type="exact", page_number=page, page_size=200
        )).body
        batch = body.records or []
        records.extend(batch)
        if len(records) >= (body.total_count or 0):
            return records
        page += 1
    raise RuntimeError("Unexpected number of apex records; refusing DNS mutation")

records = exact_apex_records()
if not records:
    print("No apex DNS records remain. Skip obsolete-record deletion.")
else:
    if len(records) != 1:
        raise RuntimeError("Unexpected extra apex DNS records; refusing deletion.")
    record = records[0]
    value = getattr(record.data, "value", None) if record.data else None
    if not (
        int(record.record_id) == OLD_RECORD_ID
        and record.record_name == APEX
        and record.record_type == "A/AAAA"
        and value == OLD_IP
        and record.proxied is False
        and int(record.site_id) == SITE_ID
    ):
        raise RuntimeError("Apex record differs from verified obsolete A record; refusing deletion.")
    print(f"Verified obsolete DNS record {OLD_RECORD_ID} for {APEX} -> {OLD_IP}; removing exact record only.")
    client.delete_record(esa_models.DeleteRecordRequest(record_id=OLD_RECORD_ID))
    for attempt in range(15):
        remaining = exact_apex_records()
        if all(int(rec.record_id) != OLD_RECORD_ID for rec in remaining):
            print("Verified obsolete apex A record was deleted. Other DNS names untouched.")
            break
        time.sleep(2)
    else:
        raise RuntimeError("Obsolete apex A record deletion did not become visible.")
