---
title: "Shine on You Crazy Interface - #golang part1"
date: 2018-02-05T20:07:41-05:00
tags: [golang,interfaces]
---

Go's interfaces are brilliant. It's not immediately apparent and at first can be confusing, but after a while its brilliance shines through.

Simply understand that if a concrete type posses all necessary methods it, the concrete type, can _implicitly_ satisfy an interface.

In Go, interfaces are considered abstract types, meaning we do not know what an interface really _is_, only what it can _do_.

The Go standard library makes use of interfaces, let's take a look at an example. Say we have the following:

Full example can be found here: https://play.golang.org/p/f9NkR_oSMo1

<pre class="prettyprint lang-go">
type song struct {
	name    string
	release time.Time
}

type songs []song

func (s songs) String() string {
	var ss []string
	for i := range s {
		ss = append(ss, s[i].name+" "+fmt.Sprint(s[i].release.Year()))
	}
	return strings.Join(ss, ", ")
}

s := songs{
	{"Comfortably Numb", time.Date(1979, time.November, 0, 0, 0, 0, 0, time.UTC)},
	{"Interstellar Overdrive", time.Date(1967, time.August, 0, 0, 0, 0, 0, time.UTC)},
	{"Time", time.Date(1973, time.March, 0, 0, 0, 0, 0, time.UTC)},
	{"High Hopes", time.Date(1994, time.March, 0, 0, 0, 0, 0, time.UTC)},
}

fmt.Println(s)
// Comfortably Numb 1979, Interstellar Overdrive 1967, Time 1973, High Hopes 1994
</pre>

Say we want to sort the above based on _release date_ so we can listen to Pink Floyd in chronological order. We could write our own sorting function, but instead, let's see if we can implement the [sort.Sort](https://golang.org/pkg/sort/#Sort) from the standard library:

<pre class="prettyprint lang-go">
func Sort(data Interface)
// where Interface is an abstract type that has three methods
type Interface interface {
    // comments omitted for brevity
    Len() int
    Less(i, j int) bool
    Swap(i, j int)
}
</pre>

So to implement `sort.Interface` we write the following three methods for our `songs` type:

<pre class="prettyprint lang-go">
func (s songs) Len() int {
    return len(s)
}

func (s songs) Less(i, j int) bool {
	return s[i].release.Before(s[j].release)
}

func (s songs) Swap(i, j int) {
	s[i], s[j] = s[j], s[i]
}
</pre>

The `sort.Sort` function doesn't care about the underlying type. So long as the type has behavior through its methods that implements `Len`, `Less` and `Swap` it can be sorted... (usually)

<pre class="prettyprint lang-go">
sort.Sort(s)
fmt.Println(s)
// Interstellar Overdrive 1967, Time 1973, Comfortably Numb 1979, High Hopes 1994
</pre>

**Note** as of Go 1.8 it's even easier to implement slice sort. See [go1.8#sort_slice](https://golang.org/doc/go1.8#sort_slice)

Full example can be found here: https://play.golang.org/p/8b2OokpqsLA

<pre class="prettyprint lang-go">
// to implement sort.Slice all we need is the Less method from above, omit Len and Swap entirely
// func Slice(slice interface{}, less func(i, j int) bool)

sort.Slice(s, s.Less)
fmt.Println(s)
// Interstellar Overdrive 1967, Time 1973, Comfortably Numb 1979, High Hopes 1994
</pre>

<hr>

To wrap things up, we were able to leverage a standard library sorting function through an interface. Our concrete type `songs` implicitly implemented the `sort.Sort` function because it had the necessary behavior (methods). The interface type `sort.Interface` defined the contract between `sort.Sort` and its caller. Awesome!