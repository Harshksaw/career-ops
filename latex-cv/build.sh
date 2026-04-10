#!/bin/bash
# Build harshsaw.tex → harshsaw.pdf
# Run twice: first pass builds structure, second pass resolves references

set -e
cd "$(dirname "$0")"

echo "Compiling CV..."
pdflatex -interaction=nonstopmode harshsaw.tex > /dev/null
pdflatex -interaction=nonstopmode harshsaw.tex > /dev/null

echo "Done! Output: $(pwd)/harshsaw.pdf"

# Clean aux files
rm -f *.aux *.log *.out
