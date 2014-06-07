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
the `csv` directory. As long as the columns remain the same, these files
can be replaced without any other changes needed, and the application will run
with the updated information.

### Adding a new CSV file ###

(To create a CSV file from an Excel Spreadsheet file, select Save As... and choose
the Comma Separated Values format)

If a new CSV file is required, it should be added to the `csv` directory.
In addition, the `csv/contents.json` file contains the column names
that are used in the application, along with the index for each column name. This
`csv/contents.json` file should be updated with the data for each new
CSV file added.

In addition, the APIs will need to make use of the new CSV file. This will depend
mostly on how the new CSV file will be used, so please take a look at the files
contained within the `routes` directory for more information.

## Architecture ##

This is a [Node.js](http://nodejs.org/) application, which among other things,
serves up a [Backbone.js](http://backbonejs.org/) based client side app
responsible for rendering the views.

### Server Side ###

As previously mentioned, this is a [Node.js](http://nodejs.org/) application.
[Hapi](https://github.com/spumko/hapi) was used as the web framework to route
requests and build up the APIs. CSV (Comma Separated Value) files are used
directly, in place of a formal database. This allows the customer easy access
to update the data by replacing the CSV files with updated versions.

#### app.js ####

The `app.js` file is the entry point for the application. This file loads
up configuration from the `config.yaml` file, specifies Hapi configuration
values, loads up the routes from the `routes` directory, and starts the server.
Most of the work on the server side is done within the routes themselves.

#### routes ####

The `routes` directory contains a collection of files which are
responsible for the APIs. The `index.js` file lists all the API endpoints
using [Hapi's route specification](https://github.com/spumko/hapi/blob/v5.0.0/docs/Reference.md#serverrouteoptions).

From there the individual routes are responsible for performing the necessary
operations to return the data requested. Often times this involves parsing
one or more CSV files and combining and returning the data to the client.

The `index.js` route is also responsible for defining the path to load the
`views/index.html` file, along with all assets for the client side application
(served from `/public`).

#### views/index.html ####

This view defines the initial HTML for the client side application, and has
a `script` tag which calls [RequireJS](http://www.requirejs.org/) to load
up all assets necessary for the Backbone.js client side application.

### Client Side ###

The client side application is loaded from requests to `/app` (requests made
to `/` are redirected to `/app`). This view initially uses
[RequireJS](http://www.requirejs.org/) to pull down all the client side
assets from the server side. Once done, [Backbone.js](http://backbonejs.org/)
is used to handle routing and rendering of views.

All client side assets are located in the `public` directory.

#### public/js/main.js ####

The `main.js` file is the entry point into RequireJS. This file defines all
the assets needed for the client side along with their relative location.
The file also calls `require(["app"]);` which kicks off the client side app.

#### public/js/app.js ####

This file is run by RequireJS, and uses [jQuery's](https://jquery.com/)
onReady function to wait until all assets are loaded to invoke Backbone. When
ready, it creates the `Router` (which handles invoking the correct view
based on the URL), and kicks off Backbone with a call to
`Backbone.history.start`.

#### public/js/router.js ####

The router creates a Backbone model and view based on the current URL.
It then passes the model to the view, and calls `render()` on the view.
This should run view specific functionality, which often involves using the
model to pull data from the server side, and using that data to render
the view. These views are ultimately templates, located in `public/templates`.
Each view is associated to a template.

## APIs ##

Each of the APIs below is defined in the `routes` directory.

### /api/zipcode-data/{zip} ###

A `GET` request to this endpoint, specifying a zip code within Texas, returns
SNAP data for that zip code. For example, a request for
`/api/zipcode-data/78704` would return:

<pre>
{
    county: "Travis",
    postOfficeLocation: "Austin",
    zip: "78704",
    totalSnapHouseholds: "1673",
    averageMonthlySnapBenefitPerHousehold: "255.72",
    totalBenefits: "427,815.00",
    totalSnapRecipients: "3523",
    recipients0To17: "1983",
    recipients18To64: "1365",
    recipients65Plus: "175",
    totalIncomeEligibleIndividuals: "11313",
    incomeEligible0To17: "3491",
    incomeEligible18To64: "7412",
    incomeEligible65Plus: "410",
    totalIncomeEligibleButNotReceiving: "7790",
    incomeEligibleButNotReceiving0To17: "1508",
    incomeEligibleButNotReceiving18To64: "6047",
    incomeEligibleButNotReceiving65Plus: "235",
    totalParticipationRate: "31%",
    participationRate0To17: "57%",
    participationRate18To64: "18%",
    participationRate65Plus: "43%",
    recipientRaceNativeAmerican: "0.00452099",
    recipientRaceAsian: "0.006458558",
    recipientRaceBlack: "0.099031216",
    recipientRacePacificIslander: "0.000861141",
    recipientRaceWhite: "0.582561895",
    recipientRaceMultiRace: "0.001291712",
    recipientRaceUnknownMissing: "0.305059203",
    recipientEthnicityHispanic: "0.634660926",
    recipientEthnicityNonHispanic: "0.278794403",
    recipientEthnicityUnknownMissing: "0.086544672",
    householdIncomeWithEarnedIncome: "0.434513772",
    householdncomeWithOnlyEarnedIncome: "0.406408094",
    averageBenefitPerRecipient: "121.43",
    averageBenefitperMeal: "1.35",
    foodBank: "Capital Area Food Bank",
    address: "8220 S. Congress, Austin, TX 78745",
    phone: "(512) 282-2130",
    website: "www.austinfoodbank.org",
    individualFoodInsecurityRate: "18.1%",
    foodInsecureIndividuals: "186,890",
    childFoodInsecurityRate: "25.5%",
    foodInsecureChildren: "62,860",
    costOfFoodIndex: "0.968",
    weightedCostPerMeal: "2.65"
}
</pre>

### /api/county-sorted-data/{county} ###

A `GET` request to this endpoint, specifying a county within Texas, returns
a set of 5 blocks of data for the top 5 zip codes within that county sorted
by `totalIncomeEligibleButNotReceiving`. The `county` value is case insensitive.
For example, a request for `/api/county-sorted-data/Travis` would return:

<pre>
[
    {
        county: "Travis",
        postOfficeLocation: "Austin",
        zip: "78741",
        totalSnapHouseholds: "3736",
        averageMonthlySnapBenefitPerHousehold: "273.46",
        totalBenefits: "1,021,648.00",
        totalSnapRecipients: "8336",
        recipients0To17: "5172",
        recipients18To64: "2934",
        recipients65Plus: "230",
        totalIncomeEligibleIndividuals: "26544",
        incomeEligible0To17: "8940",
        incomeEligible18To64: "17209",
        incomeEligible65Plus: "395",
        totalIncomeEligibleButNotReceiving: "18208",
        incomeEligibleButNotReceiving0To17: "3768",
        incomeEligibleButNotReceiving18To64: "14275",
        incomeEligibleButNotReceiving65Plus: "165",
        totalParticipationRate: "31%",
        participationRate0To17: "58%",
        participationRate18To64: "17%",
        participationRate65Plus: "58%",
        recipientRaceNativeAmerican: "0.00661044",
        recipientRaceAsian: "0.021654889",
        recipientRaceBlack: "0.09550946",
        recipientRacePacificIslander: "0.000835803",
        recipientRaceWhite: "0.557556417",
        recipientRaceMultiRace: "0.000759821",
        recipientRaceUnknownMissing: "0.317149153",
        recipientEthnicityHispanic: "0.712635818",
        recipientEthnicityNonHispanic: "0.206063369",
        recipientEthnicityUnknownMissing: "0.081300813",
        householdIncomeWithEarnedIncome: "0.546854664",
        householdncomeWithOnlyEarnedIncome: "0.5164859"
    },
    // 4 more...
]
</pre>

### /api/lookup-map-data/{zip} ###

A `GET` request to this endpoint, specifying a zip within Texas, returns
data necessary for Google Maps to provide a map of that zip code, outlining
the zip code on the map. For example, a request to
`/api/lookup-map-data/78704` returns:

<pre>
{
    zip: "78704",
    latitude: "30.2435",
    longitude: "-97.7656",
    coordinates: [
        [
            "30.234195",
            "-97.796798"
        ],
        [
            "30.244643",
            "-97.802297"
        ],
        [
            "30.267187",
            "-97.761057"
        ],
        [
            "30.264988",
            "-97.754458"
        ],
        [
            "30.250691",
            "-97.736312"
        ],
        [
            "30.250691",
            "-97.735763"
        ],
        [
            "30.215499",
            "-97.752259"
        ],
        [
            "30.234195",
            "-97.796798"
        ]
    ]
}
</pre>

### /api/constituent-stories/{county} ###

A `GET` request to this endpoint, specifying a county in Texas, returns
a story for a constituent (along with other details) within that county.
For example, a request to `/api/constituent-stories/Travis` returns:

<pre>
{
    storyId: "4",
    county: "Travis",
    constituent: "Sara and Wayne",
    story: "SNAP saved us, said Sarah. In a recent Giving City Magazine interview, Sarah shared that SNAP has helped them to do more than merely survive in the face of debilitating health problems, pending surgeries, expensive medications and no health insurance. Thanks to vegetables seeds purchased with her SNAP benefits, Sara tends to her garden at home. "The smallest victories in those garden beds represent the tenacity of life," Sarah said."
}
</pre>
