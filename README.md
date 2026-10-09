# DOLCE Decision Diagram

This repository contains a two variants of D3, the DOLCE Decision Diagram, as a simplified web-based app rather than buried/integrated in the defunct MoKi ontology editor. D3 aims to help figuring out what sort of entity you have when developing your ontology in general, or when you want to align to DOLCE specifically.

The latest version is available here: http://www.meteck.org/sw/D3App/index.html

I vibe-coded first and then made numerous changes to fix and otherwise change things. It's still brittle; see 'features', below.

## To run it locally

To run it locally on your machine and you don't have GitHub and the like, first download the repo as a zip file, and unzip it on your machine. 

Open the terminal, and

`cd` to the folder where you have unzipped the files 

Write in the command line the following command:

	ruby -run -e httpd . -p 8000

Then, in the browser, type/copy:

	http://localhost:8000/

and start as you like. 

## Features: 

- If you don't like the questions in D3 or want to add more examples, modify tree.js accordingly, restart/reload and go ahead and try again after refreshing the browser.
- treeExtended.js has the questions of the original D3 with the missing few leaf entities added. The LLM insisted on a binary tree rather than keeping the occasional MCQ, so the implemented decision tree is now different from the figure and the original implementation. If you want to use this one instead, the lazy option is to rename this file to tree.js and the other to treenew.js and restart the web app and refresh the browser. 
- It shows the trace of questions you answered. If you want to see it during the process, click on the arrow. Once you're at the leaf node and it will show it then as well.
- There's a progress bar 

There are no bugs, but it has only a limited feature set. Among others: 
- The HTML page only renders nicely in light mode, not in dark mode.
- Preferably, use the buttons to interact with the app. It's possible to do so hitting enter, but the visual feedback is then less obvious.
- Once at a leaf node, there's no back button and you'll have to start over if you don't like aligning to the leaf entity.
- The 'choice among 3-4 alternatives' has been squashed into a series of yes/no questions, adding one more temp node that D3 already had.
- You can't load your ontology to make selecting the class easier.
- It doesn't write the alignment into your ontology; you'll have to do that manually if you want the alignment in your ontology.
If you want these sort of features, and actually rather align to BFO instead: that already exists, and you can download that tool from https://github.com/mkeet/BFO2DecisionDiagram/tree/main/BFO2Classifier2.

## How to cite D3 

We created the original D3 as part of the paper about, and implementation of, the FORZA method and even though the treeExtended.js version in this repository has an extension and some rewording, it's too minor to count as substantive, so please cite the FORZA paper:

Keet, C.M., Khan, M.T., Ghidini, C. Ontology Authoring with FORZA. 22nd ACM International Conference on Information and Knowledge Management (CIKM'13). ACM proceedings, pp569-578. Oct. 27 - Nov. 1, 2013, San Francisco, USA. https://doi.org/10.1145/2505515.2505539 

The one that D3 uses now has a few questions updated because I found them confusing and I reordered a few things in the binary tree. The decision tree is now as follows (automatically generated and then rendered with GraphViz for the moment): 

![Revised D3](/D3revisedGraph.png)
