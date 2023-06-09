
  // Create root element
  // https://www.amcharts.com/docs/v5/getting-started/#Root_element
  var root = am5.Root.new("divBar");
  
  
  // Set themes
  // https://www.amcharts.com/docs/v5/concepts/themes/
  root.setThemes([
    am5themes_Animated.new(root)
  ]);
  
  
  // Create chart
  // https://www.amcharts.com/docs/v5/charts/xy-chart/
  var chart = root.container.children.push(am5xy.XYChart.new(root, {
    panX: true,
    panY: true,
    wheelX: "panX",
    wheelY: "zoomX",
    pinchZoomX: true
  }));
  
  // Add cursor
  // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
  var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
  cursor.lineY.set("visible", false);
  
  
  // Create axes
  // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
  var xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 30 });
  xRenderer.labels.template.setAll({
    rotation: -90,
    centerY: am5.p50,
    centerX: am5.p100,
    paddingRight: 15
  });
  
  xRenderer.grid.template.setAll({
    location: 1
  })
  
  var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
    maxDeviation: 0.3,
    categoryField: "name",
    renderer: xRenderer,
    tooltip: am5.Tooltip.new(root, {})
  }));
  
  var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
    maxDeviation: 0.3,
    renderer: am5xy.AxisRendererY.new(root, {
      strokeOpacity: 0.1
    })
  }));
  
  
  // Create series
  // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
  var series = chart.series.push(am5xy.ColumnSeries.new(root, {
    name: "Series 1",
    xAxis: xAxis,
    yAxis: yAxis,
    valueYField: "value",
    sequencedInterpolation: true,
    categoryXField: "name",
    tooltip: am5.Tooltip.new(root, {
      labelText: "{valueY}"
    })
  }));

  function setColor(element){
    series.columns.template.adapters.add("fill", function(fill, target) {
      var value = target.dataItem.get("valueY");
      for(var index = 0; index < element.length; index++){
        if(index == 0){
          if(value < element[index].value){
            return am5.color(0x46F2FA);
          }
        }
        if(index == (element.length-1)){
          if(value >= element[index].value){
            return am5.color(element[index].color);
          }
        }
        if(value >= element[index].value && value < element[index+1].value){
          return am5.color(element[index].color);
        }
      }
      return fill;
    });
  }

  function setData(vars, inState){

    //Set data
    var data = vars;
  
    xAxis.data.setAll(data);
    series.data.setAll(data);
    if(inState == 0){
      setColor(colors);
    }else{
      setColor(colorsState);
    }
  }
  
  // Make stuff animate on load
  // https://www.amcharts.com/docs/v5/concepts/animations/
  series.appear(1000);
  chart.appear(1000, 100);