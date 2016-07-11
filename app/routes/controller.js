import Ember from 'ember';
import mapBboxController from 'mobility-playground/mixins/map-bbox-controller';

export default Ember.Controller.extend(mapBboxController, {
	queryParams: ['bbox', 'onestop_id', 'serves', 'operated_by'],
	bbox: null,
	onestop_id: null,
	serves: null,
	operated_by: null,
	selectedRoute: null,
	hoverRoute: null,
	unstyledColor: "blue",
	bounds: Ember.computed('bbox', function(){
		if (this.get('bbox') === null){
			var defaultBoundsArray = [];
			defaultBoundsArray.push([37.706911598228466, -122.54287719726562]);
			defaultBoundsArray.push([37.84259697150785, -122.29568481445312]);
			return defaultBoundsArray;
		} else {
			var coordinateArray = [];
			var bboxString = this.get('bbox');
			var tempArray = [];
			var boundsArray = [];

			coordinateArray = bboxString.split(',');

			for (var i = 0; i < coordinateArray.length; i++){
				tempArray.push(parseFloat(coordinateArray[i]));
			}
		
			var arrayOne = [];
			var arrayTwo = [];
			arrayOne.push(tempArray[1]);
			arrayOne.push(tempArray[0]);
			arrayTwo.push(tempArray[3]);
			arrayTwo.push(tempArray[2]);
			boundsArray.push(arrayOne);
			boundsArray.push(arrayTwo);
			return boundsArray;
		}
	}),
	icon: L.icon({
		iconUrl: 'assets/images/marker.png',		
		iconSize: (20, 20)
	}),
	routes: Ember.computed(function(){
		var data = this.get('model');
		var routes = [];
		routes = routes.concat(data.map(function(route){return route;}));
		return routes;
	}),
	// operators: Ember.computed(function(){
	// 	var data = this.get('routes');
	// 	var operatorColors = [];
	// 	var operators = {};
	// 	for (var i = 0, l = data.length; i < l; i++) {
	// 		if (operatorColors.indexOf(data[i].get('operator_color')) === -1){
	// 			var color = data[i].get('operator_color');
	// 			var operatorName = data[i].get('operated_by_name');
	// 			operatorColors.push(color);
	// 			operators[operatorName] = color;
	// 		}
	// 	}
	// 	return operators;
	// }),

	routeStyleIsMode: false,
	routeStyleIsOperator: false,
	actions: {
		styleRoutesMode(){
			this.toggleProperty('routeStyleIsMode');
			this.set('routeStyleIsOperator', false);
		},
		styleRoutesOperator(){
			this.toggleProperty('routeStyleIsOperator');
			this.set('routeStyleIsMode', false);
		},
		setRoute(route){
			var onestop_id = route.get('id');
			this.set('onestop_id', onestop_id);
			this.set('selectedRoute', route);
		},
		selectRoute(route){
			route.set('route_path_opacity', 1);
			route.set('route_path_weight', 3);
			this.set('hoverRoute', route);
		},
		unselectRoute(route){
			route.set('route_path_opacity', 0.5);
			route.set('route_path_weight', 1.5);
			this.set('hoverRoute', null);
		},
		selectUnstyledRoute(route){
			route.set('route_path_opacity', 1);
			route.set('route_path_weight', 3);
			this.set('hoverRoute', route);
			route.set('default_color', "red");

		},
		unselectUnstyledRoute(route){
			route.set('route_path_opacity', 0.5);
			route.set('route_path_weight', 1.5);
			this.set('hoverRoute', null);
			route.set('default_color', "blue");
		},
		setbbox(e) {
			var bounds = e.target.getBounds();
			this.set('bbox', bounds.toBBoxString());
			let center = e.target.getCenter();
      let zoom = e.target.getZoom();
      this.set('bounds', this.get('bbox'));
      this.set('lat', center.lat);
      this.set('lng', center.lng);
      this.set('zoom', zoom);
		},
		updatebbox(e) {
			var bounds = e.target.getBounds();
			this.set('bbox', bounds.toBBoxString());
			let center = e.target.getCenter();
			let zoom = e.target.getZoom();
			this.set('bounds', this.get('bbox'));
			this.set('lat', center.lat);
			this.set('lng', center.lng);
			this.set('zoom', zoom);
		},
		setOnestopId(route) {
			var onestopId = route.id;
			this.set('onestop_id', onestopId);
			this.set('selectedRoute', route);
			var operatorOnestopId = route.operated_by_onestop_id;
			this.set('operated_by_onestop_id', operatorOnestopId);
		}
  }
	
});