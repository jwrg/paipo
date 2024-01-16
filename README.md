# Paipo

Rapid web app development for Koa.js + Postgres

This a lightweight web app development and testing
framework + springboard/scaffold/prototype stack
built on Koa, middleware for said, and Postgres.  This 
project seeks to provide a small codebase for starting a
node web app using Koa and Postgres, and attempts to
make a few sane choices for some starting middleware
and a few tools for rapid development and testing.  Hence, 
Paipo, a bodyboard; enough to keep you afloat and get you 
moving.

## Usage

To get started developing a Koa + Postgres web app,
issue the following commands:

```Shell
# Clone repository and install dependencies
git clone https://github.com/jwrg/paipo.git
cd paipo
npm install

# Apply SQL files to local database.
# NB Paipo by default looks for a localhost postgres instance on port 6899.
# The following command assumes the superuser is named postgres.
psql -p 6899 -U postgres -h localhost -f sql/schema.sql
psql -p 6899 -U paipo -h localhost -d paipodb -f sql/dummy.sql

# Spin up the app server, listening on port 6891
npm run server

# In another terminal, spin up auto-tests and linting.
# This is optional but highly recommended
npm run grunt

```

## Overview

Currently, the scope of the project is indeterminate,
but has the following goals in mind:

* Pre-configure tools for rapid development and testing
* Make a few starting choices for basic middleware (which
can be readily changed and adapted)
* Provide a small springboard Koa.js + Postgres app

### Data Visualization and Entry App

The project aims to be lightweight and OOTB is a simple
data entry app with a calendar view and a means to create,
edit, and save JSON documents.  The intention is that
one could use this to extend and/or constrain the provided
functionality to suit one or more workflows involving
timestamped JSON entries.

The stack will necessarily be split more or less along
MVC lines, with a directory each for views/layouts,
and js web scripts, with the backend in the root
folder.

Furthermore the project aims to facilitate rapid
development by providing auto-testing and -linting, and 
also support integration and end-to-end testing with
Puppeteer, behaviour driven testing using Mocha and Chai,
and by extension <abbr title="Test Driven Development">TDD
</abbr>.  Some degree of code coverage reporting is also
provided using Puppeteer and Istanbul.

### Views

The views included by default are as follows:

* Dashboard
* Calendar
  * Month View
* List Entries for Date
* Edit Entry (JSON editor)
* Settings (not yet implemented)
* Elements (for display testing)

Minimal styling is included.  A system for swapping out
CSS-variable based colour schemes is present but otherwise
the attempt is to be as barebones as possible so that one
can build something more specialized from a vanilla-esque
starting point.

### Data Models

Data and models are handled using Postgres.  The user
is expected to have a working, running instance of
Postgres (listening on port 6899).  A database schema
is included to be run using psql; this adds the necessary
user, database, and tables.  The schema is left quite
simple so that it can be easily adapted.

### Testing

Behaviour-driven end-to-end web app testing is achieved 
using Mocha, Chai and Puppeteer.  The structure of each 
test file conforms to Mocha so if one wishes to test using 
something other than Puppeteer (e.g., Selenium) one can 
adapt test files as needed.

## Requirements

The app, and by extension, the middleware stack, has 
to do stuff, and each of those stuffs ought to require
a component or components (i.e., middleware) to deal
with and/or accomplish said stuffs.  Any and all middleware
one adds are expected to be compatible with Koa v2 (still
nailing down a strictly required node version at this time).

### Current Components

The following comprise the current components of the stack.
Some functions are currently not addressed, but will be
in the future, once prerequisite functionality is
established.

Requirements and their corresponding components are
categorized according to functionality priority.

#### High Priority

The following should provide a basic workable web app:

Requirement | Middleware | Dependencies
--- | --- | ---
Content served via (reasonable) web API | Router | koa-tree-router
Content can be served from any logical path | Mounter | koa-mount
Request queries are parsed properly | Body parser | koa-bodyparser
Web content is generated using templates | Template system | koa-ejs
Content can be served via remote store | Database | node-postgresql
Users can log in to access more content | Authentication |
Multimedia (e.g., video) content served | Multimedia |

#### Low Priority

Some of these might not even get scoped when all is said and done:

Requirement | Middleware | Dependencies
--- | --- | ---
Actions can be scheduled at later times | Scheduler/cron | node-cron, later koa-cron
Source code served can be uglified | Minifier/uglifier | koa-uglify2
Content can be restricted based on role | ACL/Session manager | 
Content served can be compressed | Compression | 
Content is served from a cache | Caching | 

## JSON Editor

The app's main function is to store and edit timestamped,
id-stamped JSON entries.  The JSON editor view that is
included with the app makes no assumptions about the
structure of any data entered.  Therefore, any adaptations
one makes from this code should constrain what is already
provided, and hopefully be less complicated than
this example since the example workflow handles flavourless
JSON.

The JSON editor can be used for a range of applications
via the use of JSON entry templates, which will be added
in a future release.  The intention here is to support
data entry workflows that pre-fill keys and values based
on templates either hand-written or created using the
flavourless JSON editor.

## Configuration

Some configuration can be done within the app, but is
minimal for now until authentication is implemented.
Eventually database configuration may go here but for
now minimalism is the driving philosophy.

For now configuration is done in the cfg/ directory, 
and *not* done in package.json.


## Directory Structure

TODO
