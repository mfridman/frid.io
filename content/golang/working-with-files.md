---
title: "Files and #golang"
draft: true
---

### File existence

This function is useful when you want to have consistency checking file existence, with a bit more granularity.

<pre class="prettyprint lang-bash linenums">
func exists(file string) (bool, error) {
	_, err := os.Stat(file)
	// stat success, file exists, exit early
	if err == nil {
		return true, nil
	}
	// check for an os.ErrNotExist, "file does not exist". Return false and no errors.
	if os.IsNotExist(err) {
		return false, nil
	}
	// error from stat
	return false, err
}
</pre>

Then can use it as follows:

<pre class="prettyprint lang-bash linenums">
if ok, err := exists(f); err != nil {
    return err // this is a true error
} else if !ok {
    // file does not exist
} else if ok {
    // file exists
}
</pre>

### Creating files

This will truncate an existing file, no questions asked.
<pre class="prettyprint lang-bash linenums">
f, err := os.Create(filename)
if err != nil {
    // error
}
if err = f.Close(); err != nil {
    // error
}
</pre>

A slightly better approach is to use `os.OpenFile`, because it enables tuning _how_ the file is opened through [flags](https://golang.org/pkg/os/#pkg-constants). Append only, fail hard if file exists, etc.

<pre class="prettyprint lang-bash linenums">
// open write-only file, create if non-existent, append data when writing
f, err := os.OpenFile(filename, os.O_WRONLY|os.O_CREATE|os.O_APPEND, 0644)

// open read-write file, create if non-existent only, error if exists
// can check for os.ErrExist err by calling os.IsExist()
f, err := os.OpenFile(filename, os.O_RDWR|os.O_CREATE|os.O_EXCL, 0644)

// open read-write file, create if non-existent, truncate if exists (similar behavior to os.Create())
f, err := os.OpenFile(filename, os.O_RDWR|os.O_CREATE|os.O_TRUNC, 0644)

if err != nil {
    // error
}
if err := f.Close(){
    // error
}
</pre>

<pre class="prettyprint lang-bash linenums">
</pre>