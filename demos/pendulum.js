demos.pendulum = {};
demos.pendulum.initWorld = function(world) {
	var i=1;
	var ground = world.GetGroundBody();
	var jointDef = new b2RevoluteJointDef();
	var L = 150;
	//for (i = 0; i < 2; i++) {
		//jointDef.anchorPoint.Set(250 + 40 * i, 200 - L);
		// jointDef.body1 = ground;
		// jointDef.body2 = createBall(world, 250 + 40 * i, 200);
		// world.CreateJoint(jointDef);
	//}
	jointDef.anchorPoint.Set(320, 200 - L);
	jointDef.body1 = ground;
	jointDef.body2 = createBall(world, 320- L, 200 - L);
	world.CreateJoint(jointDef);
}
demos.InitWorlds.push(demos.pendulum.initWorld);


