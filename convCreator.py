#!/usr/bin/env python
#Recommended: Python v2.7
#Dependencies jwt, requests install via easy_install jwt
import json
import jwt
import requests
import sys

# @todo add as parameters
NETWORK = 'labs-t402.fyre.coo'  # Add your network
SITE_ID = '123456'  # change for each site
SITE_SECRET = u'1234ABCD'  # 
URL_BASE = 'http://universalmusic.com/tmp/'  # temporary url, should be reset to link back to page in emails, etc.

SAVE = True


def collection_meta_jwt(site_secret, article_id, title, url, tags=None):
    # Create JSON Obj
    data = dict(
        articleId=article_id,
        title=title,
        url=url,
    )
    if tags:
        data['tags'] = tags

    return jwt.encode(data, site_secret)


def create_collections(infos):
    for info in infos:
        create_collection(info)


def create_collection(info):
    article_id = info['article_id']
    title = info['title']
    tags = info.get('tags')
    url = URL_BASE + article_id
    meta_jwt = collection_meta_jwt(SITE_SECRET, article_id, title, url, tags=tags)
    if SAVE:
        post_url = "http://quill.{network}/api/v3.0/site/{site_id}/collection/create".format(
            network=NETWORK,
            site_id=SITE_ID)
        data_str = json.dumps({"collectionMeta": meta_jwt})
        print("Making request to {url} with data={data}".format(url=post_url, data=data_str))
        resp = requests.post(post_url, data=data_str)
        print("Response: {resp} {resptext}".format(
            resp=resp,
            resptext=resp.text))
    else:
        print("Creating Collection for article_id={article_id}, title={title}, url={url}".format(
            article_id=article_id,
            title=title,
            url=url))


if __name__ == "__main__":
    if (len(sys.argv) < 3):
        print("Usage: createConv <title> <article_id>")
        sys.exit()
        cols = [(sys.argv[1], sys.argv[2])]
    col_objs = [dict(title=k, article_id=v) for (k, v) in cols]
    create_collections(col_objs)
