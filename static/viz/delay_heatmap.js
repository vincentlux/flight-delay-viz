function heatMap(data) {
    
    // console.log(data)
    // References
    // http://bl.ocks.org/PBrockmann/raw/635179ff33f17d2d75c2/
    // http://bl.ocks.org/tjdecke/raw/5558084/


    // ===============================================================
    // Define display property.
    var margin = { top: 50, right: 0, bottom: 100, left: 50 };
    var width = 920 - margin.left - margin.right;
    var height = 310 - margin.top - margin.bottom;
    var gridSize = Math.floor(width / 24);
    var legendElementWidth = gridSize * 2;
    
    var buckets = 5;
    // var colors = ["#008000", "#6EB307", "#FFD000", "#FF8800", "#FF0000"];
    var colors = ["#FFE600", "#FFAE00", "#FF7300", "#FF5E00", "#FF0000"];


    // ===============================================================
    // Define days and hours attributes.
    var days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    var hours = ["00", "01", "02", "03", "04", "05", "06", "07",
                "08", "09", "10", "11", "12", "13", "14", "15",
                "16", "17", "18", "19", "20", "21", "22", "23"];

    // Define TEST data array.
    var days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    var hours = ["00", "01", "02", "03", "04", "05", "06", "07",
                "08", "09", "10", "11", "12", "13", "14", "15",
                "16", "17", "18", "19", "20", "21", "22", "23"];

    // Define TEST data array.
    // var data = [
    //     {DayOfWeek:1, Origin: "CLT", Dest: "PHX", CRSDepTime: "1230", DepDelay: 6.0},
    //     {DayOfWeek:1, Origin: "CLT", Dest: "PHX", CRSDepTime: "1230", DepDelay: -1.0}
    // ];

    // ===============================================================
    // Convert CRSDepTime data into 4 digits ("1" -> "0001").
    function pad_with_zeroes(CRSDepTime) {

        var my_string = '' + CRSDepTime;
        while (my_string.length < 4) {
            my_string = '0' + my_string;
        }
        return my_string;
    }
    // Call the function to update the original data.
    data.forEach(function(d){
        d.CRSDepTime =  pad_with_zeroes(d.CRSDepTime);
        if (d.DepDelay < 0 ) {
            return d.DepDelay = 0;
        }
    });
    


    // References
    // http://learnjsdata.com/group_data.html

    // ===============================================================
    // Group data based on DayOfWeek and updated CRSDepTime (DepHour).
    // Calculate the average DepDelay for each group of data.
    var arrayNested = d3.nest()
        .key(function(d) {return d.DayOfWeek;})
        .key(function(d) {return d.CRSDepTime.substring(0,2);})
        .rollup(function(d) {return d3.mean(d, function(s) {return s.DepDelay;});})
        .entries(data)
        .map(function(subgroup) {
            return {
                DayOfWeek: subgroup.key,
                Time: subgroup.values.map(function (d) {
                    return {CRSDepTime: d.key,
                            avgDepDelay: d.value}       
                })
            }
        });
    // console.log(JSON.stringify(arrayNested));
    


    // ===============================================================
    // Create the SVG canvas that will be used to render the visualization.
    var svg = d3.select("#heatmap")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Delete tooptip there is already one
    var d3Tips = d3.selectAll(".d3-tip");
    if (d3Tips.size() > 0){
        d3Tips.remove();
    }

    var tool_tip = d3.tip()
        .attr("class", "d3-tip")
        .attr("width",'100%')
        .attr("height", '100%')
        .offset([20, 120])
        .html("<p>Carriers - Average Delay</p><div id='tipDiv' ></div>");
    
    svg.call(tool_tip);

    var borderPath = svg.append("rect")
        .attr("x", -1)
        .attr("y", -1)
        .attr("rx", 6)
        .attr("ry", 6)
        .attr("height", 255)
        .attr("width", width-4)
        .style("stroke", "darkgrey")
        .style("stroke-width", "2")
        .style("fill", "none");

    // ===============================================================
    // Create the SVG canvas for legend area.
    var legend = d3.select("#legend")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + ")");


    // ===============================================================
    // Create hourLabels for x-axis and dayLabels for y-axis.
    var hourLabels = svg.append("g")
        .attr("class", "hourLabels")
        .selectAll(".hourLabel")
        .data(hours)
        .enter().append("text")
            .text(function(d) { return d; })
            .attr("x", 0)
            .attr("y", function(d, i) {
                return i * gridSize;
            })
            .style("text-anchor", "middle")
            .attr("transform", function(d, i) {
                return "translate(" + gridSize / 2 + ", -3) " +
                        "rotate(-90) " +
                        "rotate(90, 0, " + (i * gridSize) + ")"
            });

    var dayLabels = svg.append("g")
        .attr("class", "dayLabels")
        .selectAll(".dayLabel")
        .data(days)
        .enter().append("text")
        .text(function (d) { return d; })
        .attr("x", 0)
        .attr("y", function (d, i) {
            return i * gridSize;
        })
        .style("text-anchor", "end")
        .attr("transform", "translate(-3," + gridSize / 1.5 + ")");


    // ===============================================================
    // Get flattened data {DayOfWeek: "2", CRSDepTime: "16", avgDepDelay: -3}
    var flattened = [];
    arrayNested.forEach(function(day) {
        day.Time.forEach(function(CRSDepTime) {
            flattened.push({
                DayOfWeek: day.DayOfWeek,
                CRSDepTime: CRSDepTime.CRSDepTime,
                avgDepDelay: CRSDepTime.avgDepDelay
            });
        });
    });

    flattened.forEach(function(d) {
        DayOfWeek = +d.DayOfWeek,
        CRSDepTime = +d.CRSDepTime,
        avgDepDelay = +d.avgDepDelay
    });
    // console.log(flattened)
    
        
    // ===============================================================
    // Render heatmap. 
    var heatmapChart = function(data) {
        //console.log(data);
        //console.log(fullData); // global var
        var cards = svg.selectAll(".CRSDepTime")
            .data(data, function(d) {return d.DayOfWeek+':'+d.CRSDepTime;});

        cards.append("title");

        cards.enter().append("rect")
            .attr("x", function(d) { return (d.CRSDepTime) * gridSize; })
            .attr("y", function(d) { return (d.DayOfWeek-1) * gridSize; })
            .attr("rx", 4)      // define the radius of the ellipse used to 
            .attr("ry", 4)      // round off the corners of the rectangle.
            .attr("width", gridSize)
            .attr("height", gridSize)
            .style("fill", function(d) { 
                if (d.avgDepDelay <= 0) {
                    return colors[0];
                } else if (d.avgDepDelay <= 15) {
                    return colors[1];
                } else if (d.avgDepDelay <= 30) {
                    return colors[2];
                } else if (d.avgDepDelay <= 45) {
                    return colors[3];
                } else {
                    return colors[4];
                }
                
                })
            .on("mouseover", function(d) {

                // Fade in effect
                    // d3.select(".d3-tip")
                    // .style("opacity",0)
                    // .transition()
                    // .delay(100)
                    // .duration(300)
                    // .style("opacity",1)
                    tool_tip.show(d);

                    var tipSVG = d3.select("#tipDiv")
                        .append("svg")
                        .attr("width", 200)
                        .attr("height", 200);
                    
                    // tipSVG.append("rect")
                    //     .attr("fill", "steelblue")
                    //     .attr("y", 10)
                    //     .attr("width", 0)
                    //     .attr("height", 30)
                    //     .transition()
                    //     .duration(1000)
                    //     .attr("height", 100);
                    
                    // console.log(d.DayOfWeek);
                    var selectedDay = d.DayOfWeek;
                    var selectedTime = d.CRSDepTime;
                    // Match full data with selected field
                    var filteredData = fullData.filter(function(d) {return d.DayOfWeek == selectedDay 
                                                        && d.CRSDepTime.substring(0,2) == selectedTime});

                    console.log(filteredData);

                    filteredData.forEach(function(d) {
                        if (d.DepDelay < 0 ) {
                            return d.DepDelay = 0;
                        }
                    });
                    console.log(filteredData);

                    var arrayNestedTwo = d3.nest()
                    .key(function(d) {return d.CRSDepTime.substring(0,2)})
                    .key(function(d) {return d.UniqueCarrier;})
                    .rollup(function(d) {return d3.mean(d, function(s) {return s.DepDelay;});})
                    .entries(filteredData)
                    .map(function(subgroup) {
                        return {
                            Hour: subgroup.key,
                            Carriers: subgroup.values.map(function (d) {
                                return {Airlines: d.key,
                                        avgDepDelay: d.value}
                            })
                        }
                    });
                    var flattenedTwo = [];
                    arrayNestedTwo.forEach(function(y) {
                        // console.log(y);
                        y.Carriers.forEach(function(x) {
                            // console.log(x);
                            flattenedTwo.push({
                                Airlines: x.Airlines,
                                avgDepDelay: x.avgDepDelay
                            });
                        });
                    });
                    console.log(flattenedTwo)
                    // Barchart
                    
                    var height = 200;
                    var width = 200;
                    var margin = 40;
            
                    var x = d3.scaleBand().rangeRound([0, width]).padding(0.1)
                    //.domain(data.map(function (d) {return d.UniqueCarrier}))
                        .domain(flattenedTwo.map(function (d) {return d.Airlines}))
                        //.domain([0, 30])
                        .range([0 + margin, width - margin]);

                    tipSVG.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(0,"+(200-margin)+")")
                    .call(d3.axisBottom(x));


                    var airDv = flattenedTwo.map(function (d) {return d.avgDepDelay});

                    var y = d3.scaleLinear()
                        //.domain([90, 70])
                        .domain([d3.max(airDv), 0])
                        .range([margin,height-margin]);

                    // Define a color scale.
                    var bar_color = d3.scaleOrdinal(d3.schemeCategory10);

                    tipSVG.append("text")
                        .attr("class", "axis-label")
                        .attr("y", 190)
                        .attr("x",0 + (200 / 2))
                        .style("text-anchor", "middle")
                        .text("Carrier")
                        .style("fill","white");
                    
                    tipSVG.append("g")
                        .attr("class", "axis")
                        .attr("transform", "translate("+margin+",0)")
                        .call(d3.axisLeft(y));

                    tipSVG.append("text")
                        .attr("transform", "rotate(90)")
                        .attr("class", "axis-label")
                        .attr("y", -5)
                        .attr("x",0 + (200 / 2))
                        .style("text-anchor", "middle")
                        .text("Average Delay Time")
                        .style("fill","white");


                    // No move effect
                    // tipSVG.selectAll("bar")
                    // .data(flattenedTwo)
                    // .enter().append("rect")
                    // .attr("class", "bar")
                    // .style("fill", "steelblue")
                    // .attr("x", function (d) {return x(d.Airlines);})
                    // .attr("width", x.bandwidth())
                    // .attr("y", function (d) {return y(d.avgDepDelay);})
                    // .attr("height", function(d) { return height - margin - y(d.avgDepDelay); });

                    tipSVG.selectAll("bar")
                    .data(flattenedTwo)
                    .enter().append("rect")
                    .attr("class", "bar")
                    .style("fill", function(d) {return bar_color(d.Airlines);})
                    .attr("x", function (d) { return x(d.Airlines); })
                    .attr("width", x.bandwidth())
                    .attr("height", 0)
                    .attr("y", height - margin)
                    .transition()
                        .duration(1000)
                        .attr("height", function(d) { 
                            if (d.avgDepDelay == 0) {
                                return 0;
                            } else {
                                return height - margin - y(d.avgDepDelay); 
                            }
                        })
                        .attr("y", function (d) { return y(d.avgDepDelay); })
                        

                    ;
            })
            .on("mouseout", function() {
                // d3.select(".d3-tip")
                //   .transition()
                //   .duration(300)
                //   .style("opacity",0)
                //   .style('pointer-events', 'none')
                tool_tip.hide();
            });

        cards.select("title").text(function(d) { return d.avgDepDelay; });
        
        cards.exit().remove();
    }
    var fullData = data;
    heatmapChart(flattened);
    


};

