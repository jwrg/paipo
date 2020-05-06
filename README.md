# Koa Stack Prototype

This a springboard/scaffold/prototype web app stack
built on Koa and middleware for said.  This project
intends to provide a small codebase for starting a
node web app using Koa and Postgres, and attempts to
make a few sane choices for some starting middleware.

## Overview

The project aims to be lightweight and OOTB is a simple
data entry app with a calendar view.  The intention is that
one use this example to figure out how to build what they
are looking for (or better yet, if they just want to do
a variation on a task scheduling app).

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
* Settings
* Elements (for display testing)

Minimal styling is included.  A system for swapping out
CSS-variable based colour schemes.

Data and models are handled using Postgres.  The user
is expected to have a working, running instance of
Postgres (listening on port 6899).  A database schema
is included to be run using psql; this adds the necessary
user, database, and tables.  The schema is left quite
simple so that it can be easily adapted.

## Requirements

The app, and by extension, the middleware stack, has 
to do stuff, and each of those stuffs ought to require
a component or components (i.e., middleware) to deal
with and/or accomplish said stuffs.  All middleware one
adds are expected to be compatible with Koa v2.

### Current Components

The following comprise the current components of the stack.
Some functions are currently not addressed, but will be
in the future, once prerequisite functionality is
established.

Requirements and their corresponding components are
categorized according to functionality priority.

#### High Priority

Requirement | Middleware | Dependencies
--- | --- | ---
Content served is contingent on the request made | Router | koa-tree-router
Content can be served from any logical path | Mounter | koa-mount
Request queries are parsed properly | Body parser | koa-body-parser
Web content is generated using templates | Template system | koa-ejs
Content can be served via remote store | Database | node-postgresql
Users can log in to access more content | Authentication |

#### Low Priority

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
