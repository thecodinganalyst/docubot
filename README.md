# Docubot

This is a documentation generator based on [https://github.com/thecodinganalyst/next-sample](https://github.com/thecodinganalyst/next-sample).

It will generate the documentation hosted in github as a site, to allow easy browsing.

The documentation hosted on github need to follow the fixed format for navigation. 
The documentation should be grouped by categories in folders, prefixed by 2 numeric digits for sequencing followed by an underscore, then the name of the category with spaces replaced by an underscore.
For example, "01_Introduction", "02_Getting_Started"

Within each folder, the documentation should be in [markdown format](https://guides.github.com/features/mastering-markdown/). 
The documentation documents should also follow the same naming convention as the category folders.
For example, "01_Installation.md", "02_Important_Notes.md"

The above format is so that we can avoid having the [front matter](https://jekyllrb.com/docs/front-matter/) as used in [Jekyll](https://jekyllrb.com/), and this is the main differentiation from using github pages, jekyll, or hugo. 
The purpose of this is to make creation of technical documentation as easy as possible, without much configuration. So only the bare minimum functionalities are included in this project.

