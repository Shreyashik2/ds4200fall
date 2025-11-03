d3.csv("socialMedia.csv").then(function(data) {
    data.forEach(d => d.Likes = +d.Likes);

    const margin = {top: 40, right: 30, bottom: 60, left: 70};
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#boxplot")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);


    const xScale = d3.scaleBand()
        .domain([...new Set(data.map(d => d.AgeGroup))])
        .range([0, width])
        .padding(0.4);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Likes)])
        .range([height, 0]);


    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale));

    svg.append("g").call(d3.axisLeft(yScale));


    svg.append("text")
        .attr("x", width/2)
        .attr("y", height + 40)
        .attr("text-anchor", "middle")
        .text("Age Group");

    svg.append("text")
        .attr("x", -height/2)
        .attr("y", -50)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .text("Likes");

    const rollupFunction = function(groupData) {
        const values = groupData.map(d => d.Likes).sort(d3.ascending);
        const q1 = d3.quantile(values, 0.25);
        const median = d3.quantile(values, 0.5);
        const q3 = d3.quantile(values, 0.75);
        const min = d3.min(values);
        const max = d3.max(values);
        return {q1, median, q3, min, max};
    };


    const quantilesByGroups = d3.rollup(data, rollupFunction, d => d.AgeGroup);


    quantilesByGroups.forEach((q, AgeGroup) => {
        const x = xScale(AgeGroup);
        const boxWidth = xScale.bandwidth();


        svg.append("line")
            .attr("x1", x + boxWidth/2)
            .attr("x2", x + boxWidth/2)
            .attr("y1", yScale(q.min))
            .attr("y2", yScale(q.max))
            .attr("stroke", "black");


        svg.append("rect")
            .attr("x", x)
            .attr("y", yScale(q.q3))
            .attr("height", yScale(q.q1) - yScale(q.q3))
            .attr("width", boxWidth)
            .attr("stroke", "black")
            .attr("fill", "#d3d3d3");


        svg.append("line")
            .attr("x1", x)
            .attr("x2", x + boxWidth)
            .attr("y1", yScale(q.median))
            .attr("y2", yScale(q.median))
            .attr("stroke", "black");
    });
});



d3.csv("SocialMediaAvg.csv").then(function(data) {
    data.forEach(d => d.AvgLikes = +d.AvgLikes);

    const margin = {top: 40, right: 30, bottom: 60, left: 70};
    const width = 700 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#barplot")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);


    const x0 = d3.scaleBand()
        .domain([...new Set(data.map(d => d.Platform))])
        .range([0, width])
        .padding(0.2);

    const x1 = d3.scaleBand()
        .domain([...new Set(data.map(d => d.PostType))])
        .range([0, x0.bandwidth()])
        .padding(0.05);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.AvgLikes)])
        .range([height, 0]);

    const color = d3.scaleOrdinal()
        .domain([...new Set(data.map(d => d.PostType))])
        .range(["#4E79A7", "#F28E2B", "#E15759"]);


    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x0));

    svg.append("g").call(d3.axisLeft(y));


    svg.append("text")
        .attr("x", width/2)
        .attr("y", height + 40)
        .attr("text-anchor", "middle")
        .text("Platform");

    svg.append("text")
        .attr("x", -height/2)
        .attr("y", -50)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .text("Average Likes");

    const platforms = d3.groups(data, d => d.Platform);
    svg.selectAll("g.platform")
        .data(platforms)
        .enter()
        .append("g")
        .attr("transform", d => `translate(${x0(d[0])},0)`)
        .selectAll("rect")
        .data(d => d[1])
        .enter()
        .append("rect")
        .attr("x", d => x1(d.PostType))
        .attr("y", d => y(d.AvgLikes))
        .attr("width", x1.bandwidth())
        .attr("height", d => height - y(d.AvgLikes))
        .attr("fill", d => color(d.PostType));


    const legend = svg.selectAll(".legend")
        .data(color.domain())
        .enter()
        .append("g")
        .attr("transform", (d,i) => `translate(0,${i*20})`);

    legend.append("rect")
        .attr("x", width - 15)
        .attr("width", 15)
        .attr("height", 15)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 20)
        .attr("y", 10)
        .style("text-anchor", "end")
        .text(d => d);
});



d3.csv("SocialMediaTime.csv").then(function(data) {
    data.forEach(d => d.AvgLikes = +d.AvgLikes);

    const parseDate = d3.timeParse("%m/%d/%Y (%A)");
    data.forEach(d => d.Date = parseDate(d.Date));

    const margin = {top: 40, right: 30, bottom: 60, left: 70};
    const width = 700 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#lineplot")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);


    const x = d3.scaleTime()
        .domain(d3.extent(data, d => d.Date))
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.AvgLikes)])
        .range([height, 0]);


    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%m/%d")));

    svg.append("g").call(d3.axisLeft(y));


    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#4682B4")
        .attr("stroke-width", 2)
        .attr("d", d3.line()
            .x(d => x(d.Date))
            .y(d => y(d.AvgLikes))
            .curve(d3.curveNatural)
        );


    svg.append("text")
        .attr("x", width/2)
        .attr("y", height + 40)
        .attr("text-anchor", "middle")
        .text("Date");

    svg.append("text")
        .attr("x", -height/2)
        .attr("y", -50)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .text("Average Likes");
});