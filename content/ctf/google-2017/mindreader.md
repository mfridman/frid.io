---
title: mindreader
date: 2017-06-23
tags: [ctf,google,2017,lfi]
---

2017 was a tough one. Nonetheless, big thanks to <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 272 92" width="68" height="23"><path fill="#EA4335" d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/><path fill="#FBBC05" d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/><path fill="#4285F4" d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z"/><path fill="#34A853" d="M225 3v65h-9.5V3h9.5z"/><path fill="#EA4335" d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z"/><path fill="#4285F4" d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.01z"/></svg> for hosting an event. 

Challenge: Can you read my mind? No hints.

---

All you get is an input box:

<img src="/img/input.png" alt="inputbox" style="width: 250px;"/>

Checking the page source doesn't reveal anything fruitful. In hindsight the `name="f"` may have been a clue, but it's subtle. (spoiler: f for file)

{{< highlight html "linenos=table" >}}
<html>
    <head>
    </head>
    <body>
        <p>Hello, what do you want to read?</p>
        <form method="GET">
            <input type="txt" name="f">
            <input type="submit" value="Read">
        </form>
    </body>
</html>
{{< / highlight >}}     
Moving on... let's check the i/o of that input box

Entering `abc` returns a 404:

```txt
Not Found
The requested URL was not found on the server. If you entered the URL manually please check your spelling and try again.
```

Likewise other words, `flag`, `flag.txt` return a 404.

At this point one has to make a decision. Brute force, i.e., throw a word-list at the problem or continue pounding your head.

Took a step back, re-re-read the FAQ for inspiration and reiterated what I already knew. Brute-forcing is almost always not the right solution:

A good CTF challenge doesn't require a lot of guessing, in that it should be quite clear what is the problem to solve after a short time looking at it

Some google searches later, some more prodding, it's starting to feel like a local file inclusion challenge.

`/etc/passwd` (very common file on *nix system) yielded interesting output:

```bash
root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
...
```

Could spend days guessing location of the flag file, but deep down you know the answer is ...

<iframe src="https://giphy.com/embed/d1E1msx7Yw5Ne1Fe" width="auto" height="240" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/buschbeer-beer-d1E1msx7Yw5Ne1Fe"></a></p>

We know a valid file path will echo the contents of a file. Since there are a lot of files it makes sense to get an idea of where we are and what's running.

```txt
/etc/issue
Debian GNU/Linux 8 \n \l
```

```txt
/etc/debian_version
8.8
```

So we have Debian "jessie", which gives an idea what linux files we may expect. Check out [FHS] for more info.

After more probing and information gathering I moved on to `/proc`, a special-purpose filesystem that contains info about currently running processes and kernel parameters. Inspiration from [Discover the possibilities of the /proc directory]

```txt
/proc/version
Forbidden
You don't have the permission to access the requested resource. It is either read-protected or not readable by the server.
```

**Woaaaaahh!!** This is unusual and whenever you see something unusual it gets exciting. Do we need root, issues with mounting /proc? This post is getting long so I'll gloss over some bits.

`/etc` returns 404 and `/proc` returns 403

After a bunch of tinkering it became apparent the string 'proc' was getting filtered. Mash `lkkljhdfproc` on your keyboard and it'll return 403.

More inspiration. [Solving problems with proc], specifically Redirect harder:

Most UNIX tools can read from standard input, either by default or with a specified filename of "-". But sometimes we have to use a program which requires an explicitly named file. proc provides an elegant workaround for this flaw.

A UNIX process refers to its open files using integers called file descriptors. When we say "standard input", we really mean "file descriptor 0". So we can use /proc/self/fd/0 as an explicit name for standard input:

> **This trick is useful enough that many distributions provide symlinks at /dev/stdin, etc.**

```bash
$ ls -l /dev/stdin
lrwxrwxrwx 1 root root 15 Jun 25 10:04 /dev/stdin -> /proc/self/fd/0
```

Is it possible we can get access to `/proc` via the `/dev` symlinks? 

At this point it was getting frustrating [see update below]. `stderr` and `stdout` also returned 403. mindreader was not liking specific keywords. `stdin` was an okay keyword but cannot be used.

Long story needs to have an ending, [Advanced Programming in the UNIX Environment] specifically [3.16 /dev/fd] was THE article to point the compass home.

```bash
$ ls -l /dev/fd
lrwxrwxrwx 1 root root 13 Jun 25 10:04 /dev/fd -> /proc/self/fd
```

We can use `/dev/fd` symlink to access `/proc/` without .. typing .. in .. 'proc'

`/dev/fd/../../version`

```text
Linux version 3.16.0-4-amd64 (debian-kernel@lists.debian.org) (gcc version 4.8.4 (Debian 4.8.4-1) ) #1 SMP Debian 3.16.43-2 (2017-04-30)
```

FINALLY !!!! we can access `/proc`

Clearly mindreader made it difficult to get here, so now that we're here let's explore. With enough probing you'll eventually come across `environ`, this Red Hat [Chapter 5. The proc File System] was useful.

Some more probing and testing of various processes will lead to:

`/dev/fd/../environ`

**FLAG=CTF{ee02d9243ed6dfcf83b8d520af8502e1}**       


**UPDATE** I never got to the bottom of why some keywords were filtered. Here is a great explanation [Hacking Livestream #23: Google CTF Quals 2017]


[FHS]: http://www.pathname.com/fhs/
[Discover the possibilities of the /proc directory]: https://www.linux.com/news/discover-possibilities-proc-directory
[Solving problems with proc]: https://blogs.oracle.com/ksplice/solving-problems-with-proc
[Advanced Programming in the UNIX Environment]: http://poincare.matf.bg.ac.rs/~ivana/courses/tos/sistemi_knjige/pomocno/apue/APUE/0201433079/toc.html
[3.16 /dev/fd]: http://poincare.matf.bg.ac.rs/~ivana/courses/tos/sistemi_knjige/pomocno/apue/APUE/0201433079/ch03lev1sec16.html
[Chapter 5. The proc File System]:https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/3/html/Reference_Guide/s1-proc-directories.html
[Hacking Livestream #23: Google CTF Quals 2017]: https://youtu.be/KvyBn4Btv8E?t=37m29s