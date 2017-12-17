---
title: Little School Bus
date: 2017-04-14
tags: [ctf,pico,2017,steganography,lsb,least significant bit]
---

Had a blast participating with a few local [DC416](https://dc416.com/) folks in the 2017 picoCTF!

Challenge: Can you help me find the data in this littleschoolbus.bmp?

Hint: Look at least significant bit (LSB) encoding!!

---

In retrospect the solution was fairly straightforward, but, tunnel vision got the best of me. Thankfully in the end I ended up learning quite a bit about steganography and LSB. (disclaimer, it was actually solved by a teammate)

Here was the image:

<img src="/img/littleschoolbus.bmp" alt=""/>

Ran `java -jar Stegsolve.jar` to view each bit plane on its own. Click [stegsolve][stegsolve] and look for the Stegsolve download link.

```bash
# install
wget http://www.caesum.com/handbook/Stegsolve.jar -O stegsolve.jar
chmod +x stegsolve.jar

# launch/run
java -jar stegsolve.jar
```
File > Open > image, cycle through the planes. Interesting, there is something in the bottom-left corner of the image.

<img src="/img/alpha_red_plane.bmp" alt=""/>

Here is just that bottom row: <img src="/img/alpha_red_plane_crop.bmp" alt="pic7" style="width: 300px;"/>

The image is 252px × 199px (w x h). Let's concentrate on that last row, the 199th row; either crop out the pixels or write some code.

I opted to write some Go code, which you can find on [github][github-parseLSB]

```bash
./lsbParse-linux littleschoolbus.bmp

flag{remember_kids_protect_your_headers_afb3}
```

The idea was to grab each byte's LSB in sequence and construct a new binary message. Then read _that_ binary in sequence to get the flag.

|Binary|  ASCII|
|:------|-------:|
|01100110|f|
|01101100|l|
|01100001|a|
|01100111|g|
|...|...|

---

I overcomplicated the challenge by thinking there was an image _within_ the image, (inspiration drawn from this [site][DataGenetic], kudos, great resource).

Long story short, I took all the LSB's in sequence and read them in chunks of 3; obtaining values between 000-111 (decimal 0-7) to construct an 8-bit greyscale image.

**Nothing fruitful** in the reconstructed 8-bit greyscale image. Although it was a failed attempt it was fun.

(this portion was written in python w/ pyplot )
<img src="/img/convert8bit-schoolbus.png" alt="pic8" style="width: 750px;"/>

For fun, I pulled the image from [DataGenetic's site][DataGenetic] and extracted the Flanker.

<img src="/img/convert8bit-skyline.png" alt="pic8" style="width: 750px;"/>


#### Useful Resources:

[bmp-format]

[stegsolve]:http://www.caesum.com/handbook/stego.htm
[bmp-format]: http://www.dragonwins.com/domains/getteched/bmp/bmpfileformat.htm
[DataGenetic]: http://www.datagenetics.com/blog/march12012/index.html
[github-parseLSB]: https://github.com/mfridman/ctf-tools/tree/master/steganography/parseLSB
