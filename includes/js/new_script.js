var StartColor = 0xdecbca;
var EndColor = 0x59b9ba;
var fillGray = 0xbababa; 
var tooltipValue = "{name} - {value}";
var tooltipName = "{name}";
var mapBrazil = am5geodata_brazilLow;

var root = am5.Root.new("chartdiv");

root.setThemes([
    am5themes_Animated.new(root)
])

var chart = root.container.children.push(
    am5map.MapChart.new(root, {
        projection: am5map.geoMercator(),
        layout: root.verticalLayout
    })
);

var Maprender;

//Brazil map
var limitStateBrazil = am5map.MapPolygonSeries.new(root, {
    geoJSON: mapBrazil,
    calculateAggregates: true,
    valueField: "value"
});
limitStateBrazil.mapPolygons.template.setAll({
    tooltipText: tooltipValue,
    interactive: true,
    fill: am5.color(0xbababa)
});
limitStateBrazil.mapPolygons.template.events.on("click", function (ev){
    let idState = ev.target.dataItem.get("id")
    limitStateBrazil.hide()
    limitStateBrazilGray.show()
    homeButton.show()
    stateRender.dispose()
    stateRender = seriesPush(idState)
    limitStateBrazilGray.zoomToDataItem(ev.target.dataItem)
    Maprender = chart.series.push(stateRender)
})
limitStateBrazil.setAll({
    heatRules: [{
        target: limitStateBrazil.mapPolygons.template, 
        dataField: "value",
        customFunction: function(sprite, min, max, value) {
            for(var index = 0; index < colors.length; index++){
                if(index == 0){
                    if(value < colors[index].value){
                        sprite.set("fill", am5.color(0x46F2FA));
                        break;
                    }
                }
                if(index == (colors.length-1)){
                    if(value >= colors[index].value){
                        sprite.set("fill", am5.color(colors[index].color));
                        break;
                    }
                }
                if(value >= colors[index].value && value < colors[index+1].value){
                    sprite.set("fill", am5.color(colors[index].color));
                    break;
                }
            }
        }
    }]
});
limitStateBrazil.data.setAll(values);
setData(values, 0);

//Map gray
var limitStateBrazilGray = am5map.MapPolygonSeries.new(root, {
    geoJSON: mapBrazil,
    calculateAggregates: true,
    valueField: "value"
});
limitStateBrazilGray.mapPolygons.template.setAll({
    tooltipText: tooltipName,
    interactive: true,
    fill: am5.color(0xbababa)
});
limitStateBrazilGray.mapPolygons.template.events.on("click", function (ev){
    let idState = ev.target.dataItem.get("id")
    stateRender.hide()
    stateRender.dispose()
    stateRender = seriesPush(idState)
    limitStateBrazilGray.zoomToDataItem(ev.target.dataItem)
    Maprender = chart.series.push(stateRender)
})

//Inicia
var stateRender = am5map.MapPolygonSeries.new(root, {});

//render
Maprender = chart.series.push(stateRender)
Maprender = chart.series.push(limitStateBrazilGray)
Maprender = chart.series.push(limitStateBrazil)

//hide
limitStateBrazilGray.hide()
stateRender.hide()

//Button
var homeButton = chart.children.push(am5.Button.new(root, {
    paddingTop: 10,
    paddingBottom: 10,
    x: am5.percent(100),
    centerX: am5.percent(100),
    opacity: 0,
    interactiveChildren: false,
    icon: am5.Graphics.new(root, {
      svgPath: "M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8",
      fill: am5.color(0xffffff)
    })
}));
homeButton.events.on("click", function() {
    homeButton.hide();
    stateRender.hide()
    limitStateBrazilGray.hide()
    limitStateBrazil.show()
    heatLegend.set("startValue", limitStateBrazil.getPrivate("valueLow"));
    heatLegend.set("endValue", limitStateBrazil.getPrivate("valueHigh"));
    setData(values, 0);
    chart.goHome();
});

//Legend
heatLegend = chart.children.push(
    am5.HeatLegend.new(root, {
        orientation: "horizontal", 
        startColor: am5.color(colors[0].color),
        endColor: am5.color(colors[colors.length-1].color),
        stepCount: colors.length
    })
)
heatLegend.startLabel.setAll({
    fontSize: 12,
    fill: heatLegend.get("startColor")
});
heatLegend.endLabel.setAll({
    fontSize: 12,
    fill: heatLegend.get("endColor")
});
limitStateBrazil.events.on("datavalidated", function() {
    heatLegend.set("startValue", limitStateBrazil.getPrivate("valueLow"));
    heatLegend.set("endValue", limitStateBrazil.getPrivate("valueHigh"));
});

function checkState(state){
    let map;

    switch(state){
        case "BR-SC":
            map = Brazil_SC;
            break
        case "BR-PR":
            map = Brazil_PR;
            break
        case "BR-SP":
            map = Brazil_SP;
            break
        case "BR-RS":
            map = Brazil_RS;
            break
    }

    return map;
}

function checkStateValues(state){
    let status;
    switch(state){
        case "BR-SC":
            status = cityValuesSC;
            break
        case "BR-PR":
            status = cityValuesPR;
            break
        case "BR-SP":
            status = cityValuesSP;
            break
        case "BR-RS":
            status = cityValuesRS;
            break
        default:
            status = []
    }
    return status;
}

function seriesPush(idState){

    let map = checkState(idState)

    //state map
    let state = am5map.MapPolygonSeries.new(root, {
        geoJSON: map,
        calculateAggregates: true,
        valueField: "value"
    });
    state.mapPolygons.template.setAll({
        tooltipText: tooltipValue,
        interactive: true,
        fill: am5.color(0xbababa)
    });
    state.setAll({
        heatRules: [{
            target: state.mapPolygons.template, 
            dataField: "value",
            customFunction: function(sprite, min, max, value) {
                for(var index = 0; index < colorsState.length; index++){
                    if(index == 0){
                        if(value < colorsState[index].value){
                            sprite.set("fill", am5.color(0x46F2FA));
                            break;
                        }
                    }
                    if(index == (colorsState.length-1)){
                        if(value >= colorsState[index].value){
                            sprite.set("fill", am5.color(colorsState[index].color));
                            break;
                        }
                    }
                    if(value >= colorsState[index].value && value < colorsState[index+1].value){
                        sprite.set("fill", am5.color(colorsState[index].color));
                        break;
                    }
                }
            }
        }]
    });

    state.data.setAll(checkStateValues(idState));
    setData(checkStateValues(idState), 1);
    state.events.on("datavalidated", function() {
        heatLegend.set("startValue", stateRender.getPrivate("valueLow"));
        heatLegend.set("endValue", stateRender.getPrivate("valueHigh"));
    });

    return state
}