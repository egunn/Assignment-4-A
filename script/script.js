var margin = {t:50,r:125,b:50,l:125};
var width = document.getElementById('plot').clientWidth - margin.r - margin.l,  //changed to include clientWidth
    height = document.getElementById('plot').clientHeight - margin.t - margin.b;

var canvas = d3.select('.plot')
    .append('svg')
    .attr('width',width+margin.r+margin.l)
    .attr('height',height+margin.t+margin.b)
    .append('g')
    .attr('class','canvas')
    .attr('transform','translate('+margin.l+','+margin.t+')');

//Scale for the size of the circles
var scaleR = d3.scale.sqrt().domain([5,100]).range([5,120]);

d3.csv('data/olympic_medal_count.csv', parse, dataLoaded);

function dataLoaded(err,rows){

    var year = 1900;
    var top5 = 0;

//TODO: fill out this function
    d3.selectAll('.btn-group .year').on('click',function(){

        //when a button is clicked, overwrite year with its id
        var year = d3.select(this).attr('id');  //changed to .attr('id')

        if (year == 'year-1900') {
            rows.sort(function(a,b){
                //sort using the values of the 1900 attribute
                return b[1900] - a[1900];
            });
            //Note: this returns "top5" as a subset of the larger array "rows", containing positions 0,1,2,3,4
            //and save the top 5 countries for 1900
            top5 = rows.slice(0,5);

            //create a position array to hold responsive coordinates for the 5 circles representing the 5 countries.
            //Position equally distributed across the screen (for now), and halfway down the canvas.
            var position = {no1:width/6, no2:2*width/6, no3:3*width/6, no4:4*width/6, no5:5*width/6};

            draw(top5,1900);
        //    console.log(top5);
        }

        else if (year == 'year-1960'){
            rows.sort(function(a,b){
                //Note: this is called a "comparator" function
                //which makes sure that the array is sorted from highest to lowest
                return b[1960] - a[1960];  //subtract the value stored in attribute year for a from the value for b.
            });

            //Note: this returns "top5" as a subset of the larger array "rows", containing positions 0,1,2,3,4
            top5 = rows.slice(0,5);

            draw(top5,1960);

        // console.log('test1960');
        //    console.log(top5);
        }

        else if (year == 'year-2012') {
            rows.sort(function(a,b){
                //Note: this is called a "comparator" function
                //which makes sure that the array is sorted from highest to lowest
                return b[2012] - a[2012];
            });
            //Note: this returns "top5" as a subset of the larger array "rows", containing positions 0,1,2,3,4
            top5 = rows.slice(0,5);

            draw(top5,2012);
            //console.log(top5);
        }
        //console.log("Show top 5 medal count for: " + year);
        //console.log(top5);

        else {}

        console.log(top5);

    });
}

function draw(rows, year){  //top5 array from previous function used to call this one, so rows contains list of top 5 countries
    //TODO: Complete drawing function, accounting for enter, exit, update
    //Note that this function requires two parameters
    //The second parameter, "year", determines which one of the three years (1900,1960,2012) to draw the medal counts based on

    var visualizations = canvas.selectAll('.country')   //select all items of class country currently on the canvas
                                                        //(should be zero for the first run). Save as variable

        .data(rows, function(d) {return d.country;});   //bind the data array to the country name using a key function

    //Enter
    var newVis = visualizations.enter().append('g')                //Create enter set, empty placeholders on 1st run
                                                        //Do not append directly, because want to be able to append multiple country groups
                                                        //all containing circles and text attributes.

                                                          //Append a new group of class country to newVis
        .attr('class','country')
        .attr('transform', function(d,i) {                //Position new group so that it doesn't fly in from corner of pg
            return 'translate(' + i*width/4 + ',' + height/2 + ')';  //Use index values for accessor function to translate each
                                                        //circle according to its position in the rows array (since it starts at 0,
                                                        //divide width into 4 segments, which puts on circle at 0, one at max, and 3 in middle)
        });

        newVis.append('circle')

        //set fill color according to country attribute, using an accessor function to access data array values
        .style('fill', function(d) {
            //use an accessor function to read the data stored inside the object. Then, use an if/else statement to compare
            //the contents of the d.country string with the known country names, and return a different color as a string for each one
            if (d.country == 'Australia')           { return 'coral';  }
            else if (d.country == 'Belgium')        { return 'orange'; }
            else if (d.country == 'China')          { return 'yellow';  }
            else if (d.country == 'Denmark')        { return 'lt-green'; }
            else if (d.country == 'France')         { return 'green';  }
            else if (d.country == 'Germany')        { return 'aqua';   }
            else if (d.country == 'Great Britain')  { return 'blue';  }
            else if (d.country == 'Hungary')        { return 'purple'; }
            else if (d.country == 'Italy')          { return 'magenta'; }
            else if (d.country == 'Japan')          { return 'brown'; }
            else if (d.country == 'Mixed team')     { return 'gray'; }
            else if (d.country == 'Poland')         { return 'lt-purple';  }
            else if (d.country == 'Soviet Union')   { return 'crimson';  }
            else if (d.country == 'Switzerland')    { return 'teal';  }
            else if (d.country == 'United States')  { return 'turquoise'; }
            else                                    { return 'black'; }
          })

        .attr('r', 0);   //use data value stored in rows.year to set circle size
                                                              //note use of square brackets d[year] to insert value of var year

    newVis.append('text')                                     //append text to same group
        .text(function(d){return d.country; })//retrieve country label from rows array, use as text
        .attr('class', 'label')
        .attr('text-anchor', 'middle')
        .attr('font-size','12px')
        .style('fill','rgb(235,235,235)');

    newVis.append('text')                                     //append text to same group
    //    .text(function(d){return d[year]+' medals'; })//retrieve country label from rows array, use as text
        .attr('class', 'count')
        .attr('text-anchor', 'middle')
        .attr('transform', 'translate(0, 150)')
        .attr('font-size','12px')
        .style('fill','rgb(80,80,80)');

    //Exit
    visualizations.exit()
        .transition(50)
        .remove();

    //Update
    visualizations
        .transition(100)
        .delay(200)
        .attr("transform", function(d,i) {
            return 'translate(' + i*width/4 + ',' + height/2 + ')';
        })
        .select('circle')  //already exists, so don't need to append new circles to update set.
                            //select the group containing both circle and text - otherwise, text gets left on screen
        .attr('r', function(d){ return scaleR(d[year]);
        });
    visualizations
        .select('.label')
        .text(function(d){return d.country; });
    visualizations
        .select('.count')
        .text(function(d){return d[year] + " medals"; });
}

function parse(row){
    //@param row is each unparsed row from the dataset
    return {
        country: row['Country'],
        1900: +row['1900'],
        1960: +row['1960'],
        2012: +row['2012']
    };
}
