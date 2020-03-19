# Koa Stack Prototype

This is nothing more than a prototype web app stack
built on Koa and middleware for said.  This is a test
bed project for a higher-quality project which will
serve as a springboard for all future node web apps.

## Overview

The project will be little more than an example
data entry app with a calendar view.  Hopefully one can
use this example to figure out how to build what they
are looking for (or if they just want a task scheduling
app to build on).

The stack will necessarily be split more or less along
MVC lines, with a directory each for views/layouts,
and js web scripts, with the backend in the root
folder.

The views included by default are as follows:

* Dashboard
* Calendar
* View Entry
* New Entry
* Edit Entry

Minimal styling is included.

Data and models are handled using Postgres.  A local
instance may be included in the initial scaffold,
usable OOTB.  It also serves as an example should one
wish to use a remote instance of Postgres.  The success
of this bit will dictate whether we keep going with
Postgres or use some kind of ORM to further abstract the
data fetch/update process and use other DBMS's.

## Requirements

The stack has to do stuff, each stuff should require
a component or components (i.e., middleware) to deal
with said stuffs.  All middleware are expected to be
compatible with Koa v2.

### High Priority

Requirement | Middleware | Dependencies
--- | --- | ---
Content served is contingent on the request made | Router | koa-tree-router
Content can be served from any logical path | Mounter | koa-mount
Request queries are parsed properly | Body parser | koa-body-parser
Web content is generated using templates | Template system | koa-ejs
Content can be served via remote store | Database | node-postgresql
Users can log in to access more content | Authentication |

### Low Priority

Requirement | Middleware | Dependencies
--- | --- | ---
Actions can be scheduled at later times | Scheduler/cron | node-cron, later koa-cron
Source code served can be uglified | Minifier/uglifier | koa-uglify2
Content can be restricted based on role | ACL/Session manager | 
Content served can be compressed | Compression | 
Content is served from a cache | Caching | 

## Example workflows

### Login and logout

1. GET the app root -> receive login page
2. POST login query -> receive user dashboard
3. POST logout query -> receive login page
