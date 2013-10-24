/**
 * Created by DaveVoyles on 10/23/13.
 */
function setupInputControls() {

    var shootAutoRepeat = 100;

    window.Bindings ={} ;

    var bdi = 0; // binding index
    ig.input.bind(ig.KEY.LEFT_ARROW,         Bindings.left=bdi++);
    ig.input.bind(ig.KEY.RIGHT_ARROW,       Bindings.right=bdi++);
    ig.input.bind(ig.KEY.UP_ARROW,             Bindings.up=bdi++);
    ig.input.bind(ig.KEY.DOWN_ARROW,         Bindings.down=bdi++);

    ig.input.bind(ig.KEY.C,                 Bindings.shoot=bdi++);
    ig.input.bind(ig.KEY.TAB,        Bindings.switchWeapon=bdi++);
    ig.input.bind(ig.KEY.X,              Bindings.slowTime=bdi++);
    ig.input.bind(ig.KEY.Q,        Bindings.spawnCompanion=bdi++);
    ig.input.bind(ig.KEY.MOUSE1,                  Bindings.shoot);
    ig.input.bind(ig.KEY.MOUSE2,       Bindings.rightClick=bdi++);
    ig.input.bind(ig.KEY.ESC,                Bindings.menu=bdi++);
    ig.input.bind(ig.KEY.V,           Bindings.spawnTurret=bdi++);
    ig.input.bind(ig.KEY.B,          Bindings.shootMissile=bdi++);

    ig.input.bind(ig.KEY.ENTER,                Bindings.ok=bdi++);
    ig.input.bind(ig.KEY.SPACE,                      Bindings.ok);

    ig.input.setAutoRepeat(Bindings.shoot, shootAutoRepeat);

    Bindings.enter = Bindings.ok;
    Bindings.click = Bindings.shoot;

    // in case some bonuses changes fire rate.
    Bindings.changeAutoRepeat = function (newAR) {    ig.input.bind(ig.KEY.C, Bindings.shoot, newAR);   };

    // with this trick, setup is done only once, and still you can call
    // setupInputControls everywhere
    setupInputControls = function() {};
}