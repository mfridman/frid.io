---
title: "No Eyes"
date: 2017-04-14
tags: [ctf,pico,2017,sql injection,half blind]
---

Challenge: The website isn't really me much, but you can still get the admin password, right?

Hint: Sometimes an error message can be just as useful

---

This one was _really_ rewarding.

So, the landing page looked like this:

<img src="/img/landing_page.png" alt=""/>

Based on the description we assume the username is _admin_ so let's focus on the password field.

Entering a single quote results in an error, great, there is a problem with the query, we know the syntax and it appears to be injectable.

<img src="/img/sql_error.png" alt=""/>

#### Injectables

`' and 1=1--` results in an _Incorrect Password_.

`' or 1=1--` results in an interesting message:


<img src="/img/login.png" alt=""/>

We were stuck here for a bit, but, one night I got an idea based on these 2 pieces of information:

1. We're specifically looking for the admin password
2. We know the query for the password field, so let's ask it specific questions about the password

The query we used moving forward was: `' or pass LIKE "%"--` which also gave the interesting message:

```text
Login Functionality Not Complete. Flag is 63 characters
```

**Note the use of the LIKE operator**

Does the password start with...?  
`' or pass LIKE "a%"--` : Incorrect Password.
`' or pass LIKE "b%"--` : Incorrect Password.
[...]
`' or pass LIKE "n%"--` : **Login Functionality Not Complete. Flag is 63 characters**
`' or pass LIKE "o%"--` : Incorrect Password.

Alright, now we're getting somewhere. The first letter of the password is **n**

A bit of Go code, found on [github], and a few POST requests later, 1,215 to be exact:

<img src="/img/noEyes.gif" alt=""/>

...and our flag is:

**not_all_errors_should_be_shown_fb83c582ee9b64d1f446cfd01702e7c5**

[github]: https://github.com/mfridman/ctf-tools/blob/master/sqlInjection/halfBlind/main.go
