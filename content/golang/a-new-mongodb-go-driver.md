---
title: "A mongoDB Go Driver - by the mongoDB folks"
date: 2018-02-22T17:36:50-05:00
tags: [mongodb,nosql,database,rethinkdb,golang]
---

So this is exciting, the mongoDB team is working on an official mongoDB Go driver. The official announcement can be found at [MongoDB Go Driver Alpha 1 released](https://groups.google.com/forum/#!topic/mongodb-go-driver/MGuX7GtFocw)

For those interested _why_ mongoDB chose to write a driver from the ground-up as apposed to forking [mgo](https://github.com/go-mgo/mgo) read their [engineering blog](https://engineering.mongodb.com/post/considering-the-community-effects-of-introducing-an-official-golang-mongodb-driver)

The repo can be found on github [mongo-go-drive](https://github.com/mongodb/mongo-go-driver) and bug reports should be filed over on [jira.mongodb.org](https://jira.mongodb.org/projects/GODRIVER/issues)

I've been wanting to give mongoDB a fair shot, and now seems to be the right time.

_We wanted to invite people who wanted something more to try something new..._

I'm in.

---

#### A note about my prior/current go-to nosql db: rethinkDB

<br>

For a while now [rethinkDB](https://www.rethinkdb.com) has been my go-to nosql database. Hands-down it has been an amazing experience, from the database features to the artwork to the documentation. They took their time and they did it right. So thank you to all the hard work the rethinkDB folks poured into the project. 

Each time rethinkDB comes up in conversations, 8/10? folks have the same reaction: "sigh.. really wish they could have monetized and kept the project going". The official word from the author can be found [here](https://rethinkdb.com/blog/rethinkdb-shutdown/) and [here](http://www.defmacro.org/2017/01/18/why-rethinkdb-failed.html)

As a side note, I enjoyed this writeup [RethinkDB versus PostgreSQL: my personal experience](http://blog.sagemath.com/2017/02/09/rethinkdb-vs-postgres.html)

**NOTE** although the rethinkdb "company" shut down, the project lives on with the community under the Linux Foundation, read about the [announcement](https://rethinkdb.com/blog/rethinkdb-joins-linux-foundation/) or listen to the changelog episode [The Future of RethinkDB](https://changelog.com/podcast/266)

From a Go perspective the [gorethink](https://github.com/GoRethink/gorethink) driver is quite stable. It should be noted that a while back the original author decided it was time to step back [github issue#392](https://github.com/GoRethink/gorethink/issues/392). I believe the project is still lightly maintained.

To conclude, both rethinkDB and the Go driver are working just fine for me, and I'll continue using them for the foreseeable future. But it has come time to branch out and experiment with mongoDB.