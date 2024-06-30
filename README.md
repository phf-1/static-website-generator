# Yet an other static website generator

## Which programs are required?

- `bash`
- `fd`
- `git`
- `inotifywait`
- `make`
- `node`
- `python3`
- `ripgrep`
- `rsync`

## How to install it?

```Bash
git clone git@github.com:phf-1/static-website-generator.git
cd static-website-generator
npm install
./configure --source ../articles --prefix ../website
```

where:
- `../website` is a directory under `git` control with a remote on GitHub Pages for instance.

and:
```
$ tree articles/00000000-0000-0000-0000-000000000000
articles/00000000-0000-0000-0000-000000000000
├── article.html
├── data
│   ├── image.png
│   └── …
├── description
└── lang

$ cat articles/00000000-0000-0000-0000-000000000000/description 
Welcome.

$ cat articles/00000000-0000-0000-0000-000000000000/lang
en

$ cat articles/00000000-0000-0000-0000-000000000000/article.html
<h1>Title</h1>

<h2>Introduction</h2>

…
```

## How to publish a new article?

```
$ cd static-website-generator
$ make new
/path/to/articles/9204af1b-d898-4445-a1a6-d9cf54cbd259
$ cd /path/to/articles/9204af1b-d898-4445-a1a6-d9cf54cbd259
# edit ./article.html
# add data to ./data/
# edit ./description
# edit ./lang
$ cd -
$ make publish
```
