---
title: "Shine on You Crazy Interface - #golang part2"
date: 2018-02-05T20:07:41-05:00
tags: [golang,interfaces]
draft: true
---

WIP

No interface discussion is complete without talking about the [fmt.Stringer](https://golang.org/pkg/fmt/#Stringer) interface. This is a classic when introducing the topic of interfaces.

Notice in [part1]({{< relref "shine-on-you-crazy-interface.md" >}}) we actually made use of this interface to format the `songs` type.

<pre class="prettyprint lang-go">
func (s songs) String() string {
    var ss []string
    for i := range s {
        ss = append(ss, s[i].name+" "+fmt.Sprint(s[i].release.Year()))
    }
    return strings.Join(ss, ", ")
}
</pre>

When we called a print function the output was nicely formatted:

<pre class="prettyprint lang-go">
fmt.Println(s)
// Comfortably Numb 1979, Interstellar Overdrive 1967, Time 1973, High Hopes 1994
</pre>

If we remove the above `String()` method the output for the `song` type would be:

<pre class="prettyprint lang-go">
fmt.Println(s)
// [{Comfortably Numb {0 62445772800 <nil>}} {Interstellar Overdrive {0 62059132800 <nil>}} {Time {0 62235302400 <nil>}} {High Hopes {0 62897990400 <nil>}}]
</pre>

So let's take a step back and look at the `fmt.Stringer` interface:

<pre class="prettyprint lang-go">
type Stringer interface {
	String() string
}
</pre>

To satisfy the Stringer interface our concrete type must have a method with the `String() string` signature, which we already saw above.

By satisfying the Stringer interface we can take advantage of functions throughout the standard library that leverage this interface to print values. Most notably this will be used with the `fmt` package, where we call `fmt.Println` and the output will be formatted according to our representation of the value.


<pre class="prettyprint lang-go">
</pre>