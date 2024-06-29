```
make help                           This help.
make cname                          Install the CNAME under ${BUILD_DIR}.
make manifest                       Install the webmanifest under ${BUILD_DIR}.
make css                            Install the css directory under ${BUILD_DIR}.
make favicon                        Install the favicon directory under ${BUILD_DIR}.
make font                           Install the font directory under ${BUILD_DIR}.
make js                             Install the js directory under ${BUILD_DIR}.
make page                           Install the page with UUID ${UUID} under ${BUILD_DIR}.
make all                            Build the website under ${BUILD_DIR}. If given ONCHANGE=true, then: rebuild on change.
make server                         Start a web server serving files from the current directory.
make new                            Add a new page.
make list                           List pages.
make delete                         Delete a page with uuid UUID.
make format                         Format files.
make install                        Install the website under ${PREFIX}.
make publish                        Publish the website.
make clean                          Clean all generated files.
```
