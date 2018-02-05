---
title: "Toolkit"
---

#### Upgrade Go version (Mac)

Always be wary of things you find on the internet that use a combination of wget, tar and sudo.

[Go downloads](https://golang.org/dl/)

<pre class="prettyprint lang-bash linenums">
# remove old version
sudo rm -rf /usr/local/go
# download a Go version, redirect output to stdout (quietly), pipe into tar and print version
wget -qO- https://dl.google.com/go/go1.5.2.darwin-amd64.tar.gz | sudo tar -C /usr/local -xz && go version
# go version go1.5.2 darwin/amd64
</pre>