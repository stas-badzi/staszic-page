#!/bin/sh
cat compile.sh | sed 's/-Ofast/-g/g' > __debug.sh
chmod 700 __debug.sh
./__debug.sh
rm __debug.sh