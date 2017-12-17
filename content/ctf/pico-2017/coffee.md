---
title: coffee
date: 2017-04-14
tags: [ctf,pico,2017,java,reverse]
---

Challenge: You found a suspicious USB drive in a jar of pickles. It contains this file

```bash
$ file freeThePickles.class
freeThePickles.class: compiled Java class data, version 52.0 (Java 1.8)
```

Hint: Is there a way to get the source of the program?

---

Although this challenge didn't call for it, if you want to disassemble a class file use `javap` like so...

`javap -verbose freeThePickles.class > freeThePickles`

Anyways, back to the challenge. I used a "cloud-based" decompiler, [javadecompilers.com][java-decomp], with the JDCore decompiler option and it spat back the source code:

```java
import java.util.Base64.Decoder;

public class problem {
  public problem() {}

  public static String get_flag() { String str1 = "Hint: Don't worry about the schematics";
    String str2 = "eux_Z]\\ayiqlog`s^hvnmwr[cpftbkjd";
    String str3 = "Zf91XhR7fa=ZVH2H=QlbvdHJx5omN2xc";
    byte[] arrayOfByte1 = str2.getBytes();
    byte[] arrayOfByte2 = str3.getBytes();
    byte[] arrayOfByte3 = new byte[arrayOfByte2.length];
    for (int i = 0; i < arrayOfByte2.length; i++)
    {
      arrayOfByte3[i] = arrayOfByte2[(arrayOfByte1[i] - 90)];
    }
    System.out.println(java.util.Arrays.toString(java.util.Base64.getDecoder().decode(arrayOfByte3)));
    return new String(java.util.Base64.getDecoder().decode(arrayOfByte3));
  }

  public static void main(String[] paramArrayOfString) {
    System.out.println("Nothing to see here");
  }
}
```

For shits and giggles I rewrote the above logic with python &#x1f40d;
```python
import base64
str2 = "eux_Z]\\ayiqlog`s^hvnmwr[cpftbkjd"
str3 = "Zf91XhR7fa=ZVH2H=QlbvdHJx5omN2xc"
arrayOfByte1 = str2.encode()
arrayOfByte2 = str3.encode()
arrayOfByte3 = []
i = 0
while i < 32:
    a = arrayOfByte2[(arrayOfByte1[i]-90)]
    i = i + 1
    arrayOfByte3.append(a)

letters = ""
for i in arrayOfByte3:
    letters = letters + chr(i)
flag = base64.b64decode(letters).decode("utf-8")
print(flag)
```

```bash
$ python3 freeThePickles.py
flag_{pretty_cool_huh}
```

The intended solution was to probably throw the decrypting function `get_flag()` into `main()`, recompile the .java file with `javac` and execute.

[java-decomp]: http://www.javadecompilers.com
