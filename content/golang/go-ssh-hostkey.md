---
title: "Validating host keys in Go's ssh package"
date: 2017-09-04
draft: true
tags: [golang,ssh,hostkey,HostKeyCallback]
---

So you upgraded the package: `go get -u -v golang.org/x/crypto/...`

and got an error: `ssh: must specify HostKeyCallback`

A quick google search returns this great post [Golang SSH Security], as well as [issue#19767] and [e4e2799].

Briefly, prior to the patch users could omit `HostKeyCallback` from `ClientConfig`, allowing SSH connections to bypass host key checking and "just work".

Given the onus is on the client to verify the identity of the host, this was a step in the right direction in terms of security. E.g., [MITM attack]

**For sake of clarity, neither Go or the docs had issues. It was users misusing the library.**

<br>

So what can you do?

1.use `InsecureIgnoreHostKey()`, allowing almost any host key to be used.

> It should not be used for production code.

2.use `FixedHostKey()` and pass in a key from known_hosts file, typically `$HOME/.ssh/known_hosts`

<br>

For an example check out [ExampleHostKeyCheck()], which assumes standard port

Some gotchas, if you have many hosts with varying ports on a single domain/IP address the above snippet will match the **first occurrence**, return _an_ incorrect host key to the caller and `ssh.Dial` will eventually fail:

`ssh: handshake failed: ssh: host key mismatch`

Another issue is if you have many hosts to check, you don't want the entire program to exit due to a single failed host key check, watch out for `log.Fatalf` which is `Printf()` followed by call to `os.Exit(1)`

Furthermore, for non-standard ports you'll need to modify the above snippet. Because non-standard ports have hostnames enclosed with square brackets followed by a colon and the port number:

```
[ssh.example.com]:1999 ssh-rsa AAAAB3Nza...vguvx+81N1xaw==
[ssh.example.com]:1999,[93.184.216.34]:1999 ssh-rsa AAAAB3Nza...vguvx+81N1xaw==
```

<hr>

A slightly different approach may be to validate the port: [validatePort()]

```go
port, err := validatePort(SSHport)
if err != nil {
    // handle error
}
```

Then pass hostname & port into a slightly modified ExampleHostKeyCheck function: [checkHostKey()]

```go
hostKey, err := checkHostKey(hostname, port)
if err != nil {
    // handle error
}
```

Setup `ssh.ClientConfig` with `ssh.FixedHostKey(hostKey)`

```go
// this is an example
conf := &ssh.ClientConfig{
    User: username,
    Auth: []ssh.AuthMethod{
        ssh.Password("is{pass1234}g00Den0ugh?")
    },
    HostKeyCallback: ssh.FixedHostKey(hostKey),
    Timeout: 2 * time.Second,
}
```

Once the bits and pieces are in place attempt to connect to the remote server and perform an SSH handshake

```go
client, err := ssh.Dial("tcp", hostname+":"+port, conf)
```

At each step prior to `ssh.Dial` errors can be handled gracefully.

[Golang SSH Security]:https://bridge.grumpy-troll.org/2017/04/golang-ssh-security/
[issue#19767]:https://github.com/golang/go/issues/19767
[e4e2799]:https://go-review.googlesource.com/c/crypto/+/38701
[MITM attack]:https://en.wikipedia.org/wiki/Man-in-the-middle_attack
[ExampleHostKeyCheck()]:https://github.com/golang/crypto/blob/81e90905daefcd6fd217b62423c0908922eadb30/ssh/example_test.go#L143
[validatePort()]:https://gist.github.com/mfridman/a1c93596441bb4f5ed514e22ba483989#file-go-ssh-hostkey-go-L4
[checkHostKey()]:https://gist.github.com/mfridman/a1c93596441bb4f5ed514e22ba483989#file-go-ssh-hostkey-go-L17