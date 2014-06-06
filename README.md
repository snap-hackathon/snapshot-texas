# SNAPshot Texas #

Displays data about the SNAP program for the Texas Food Bank Network. The data
is organized by zip code to show how SNAP benefits are used in the area, and also
general demographics of the region.

## Getting Started ##

### Install Node.js ###

This is a [Node.js](http://nodejs.org/) app, so to begin, please head over to the
[Node.js site](http://nodejs.org/) to download Node. A good set of installation
instructions is available here: https://github.com/joyent/node/wiki/Installation

### Install Git ###

This project uses [Git](http://www.git-scm.com/) as a means of source control, and
is required to get the source code for this project. Make sure your system has
Git installed.

### Clone the Project ###

Once the prerequisites are met, you can clone this repository to your machine.
The repository URL should be available on the GitHub page (possibly to the right).
If you have access to the [GitHub GUI](https://github.com/) you can clone the
repository by clicking on the "Clone in Desktop" button.

### Install Dependencies ###

Once the project is cloned, change directories to the project directory and install
the project dependencies by issuing this command from the command prompt:

<code>$ npm install</code>

This will install all the Node.js dependencies for this project.

### Start the Application ###

Once the dependencies are installed, you can start the application by running the
command:

<code>$ npm start</code>

This will output some messages, and should end with a message:

<code>Server started at: http://0.0.0.0:8000</code>

You can bring up a browser and navigate to http://localhost:8000 to view the running
application.

## CSV Files ##

The data used by the application is all contained within a set of CSV files (which
are very similar to Excel Spreadsheet files). These files are all contained within
the <code>csv</code> directory. As long as the columns remain the same, these files
can be replaced without any other changes needed, and the application will run
with the updated information.

### Adding a new CSV file ###

(To create a CSV file from an Excel Spreadsheet file, select Save As... and choose
the Comma Separated Values format)

If a new CSV file is required, it should be added to the <code>csv</code> directory.
In addition, the <code>csv/contents.json</code> file contains the column names
that are used in the application, along with the index for each column name. This
<code>csv/contents.json</code> file should be updated with the data for each new
CSV file added.

In addition, the APIs will need to make use of the new CSV file. This will depend
mostly on how the new CSV file will be used, so please take a look at the files
contained within the <code>routes</code> directory for more information.
