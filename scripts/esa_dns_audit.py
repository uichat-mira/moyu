#!/usr/bin/env python3
"""Read-only ESA apex DNS audit; prints only non-secret DNS metadata."""
import os
import sys
import json
from alibabacloud_tea_openapi import models as open_api_models
from alibabacloud_esa20240910.client import Client
from alibabacloud_esa20240910 import models as esa_models

apex = "6260381.xyz"
config = open_api_models.Config(
    access_key_id=os.environ["ALIBABA_CLOUD_ACCESS_KEY_ID"],
    access_key_secret=os.environ["ALIBABA_CLOUD_ACCESS_KEY_SECRET"],
    endpoint="esa.cn-hangzhou.aliyuncs.com",
)
api = Client(config)
response = api.list_sites(esa_models.ListSitesRequest(site_name=apex, site_search_type="exact", page_number=1, page_size=20))
sites = response.body.sites or []
matches = [s for s in sites if s.site_name == apex and s.status == "active"]
if len(matches) != 1:
    raise RuntimeError(f"Expected exactly one active ESA site {apex}; matched {len(matches)}")
site = matches[0]
print(json.dumps({"site_name": site.site_name, "site_id": str(site.site_id), "status": site.status, "access_type": site.access_type, "coverage": site.coverage, "nameservers": site.name_server_list}, ensure_ascii=False))
page = 1
all_records = []
while True:
    response = api.list_records(esa_models.ListRecordsRequest(site_id=site.site_id, record_name=apex, record_match_type="exact", page_number=page, page_size=200))
    rows = response.body.records or []
    all_records.extend(rows)
    if not rows or len(all_records) >= (response.body.total_count or 0):
        break
    page += 1
    if page > 10:
        raise RuntimeError("Unusually large apex record set; aborting audit")
for rec in all_records:
    val = getattr(rec.data, "value", None) if rec.data else None
    print(json.dumps({"record_id": str(rec.record_id), "record_name": rec.record_name, "record_type": rec.record_type, "record_value": val, "proxied": rec.proxied}, ensure_ascii=False))
print(f"DNS_AUDIT_RECORD_COUNT={len(all_records)}")
