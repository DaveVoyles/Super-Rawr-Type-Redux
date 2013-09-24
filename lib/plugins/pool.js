/*
 *  @pool.js

 *  @author: Dave Voyles, via Liza Shulyayeva
 *  @date: April 2013
 *  @copyright (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *
 * Generic object pooling class, for particles, bullets etc.
 * Original class is found at the following location: 
 * https://github.com/drakonka/Promiscuous-Flea/blob/master/lib/game/misc/pool.js
 */
ig.module(
	'plugins.pool'
)
.requires(
	'impact.impact'
)
.defines(function () {
    "use strict";

    ig.Pool = ig.Class.extend({

        allBulletsArr: [],
        allEggsArr: [],

        /********************************************************
        * addToPool
        * Adds objects to the beginning of array
        ********************************************************/
        addToPool: function (entity, arr) {
            arr.unshift(entity);
        },

        /********************************************************
        * useObject
        * Makes use of the object stored in the pool
        ********************************************************/
        useObject: function (object, attributes) {
            // Set poolArr and entityType depending on which entity is being used
            var poolArr = null;
            var entityType = null;
            var entity = null;
            switch (object) {
                case 'bullet':
                    poolArr = this.allBulletsArr;
                    entityType = 'EntityBullet';
                    break;
                case 'egg':
                    poolArr = this.allEggsArr;
                    entityType = 'EntityBabyflea';
                    break;
            }

            // Get first entity in relevant pool
            entity = poolArr[0];

            // If the entity is not already in use...
            if (entity.inUse === false) {

                //  Set any additional attributes
                for (var propt in attributes) {
                    entity[propt] = attributes[propt];
                }

                // Initialize entity
                entity.initialize();
                entity.inUse = true;

                // Move the now used entity to the end of the pool
                this.moveArrElement(poolArr, 0, poolArr.length - 1);
            }

                // If the entity IS already in use, either the array is cluttered or there are no free entities left in the pool...
            else {
                // Loop through pool backwards
                for (var i = poolArr.length - 1; i > 0; i--) {
                    entity = poolArr[i];
                    // If the entity is not in use, move it to the front of the array
                    if (!entity.inUse) {
                        this.moveArrElement(poolArr, i, 0);
                    }

                }

                //If no available entities were found, spawn a new entity.
                //TODO: We don't want to spawn additional entities. Just keep re-using what we have
                //if (!foundAvailableEntity) {
                //    ig.game.spawnEntity(entityType, 0, 0);
                //}
                this.useObject(object, attributes);
            }
        },


        /********************************************************
        * removeEntity
        * Deactivates entity by setting inUse bool to false
        ********************************************************/
        removeEntity: function (entity) {
            entity.inUse = false;
        },

        /********************************************************
        * removeAllObjects
        * Removes objects from array pool to make use of them
        ********************************************************/
        removeAllObjects: function (object) {
            var poolArr;
            switch (object) {
                case 'bullet':
                    poolArr = this.allBulletsArr;
                    break;
                case 'egg':
                    poolArr = this.allEggsArr;
                    break;
            }

            // If objects are currently being used (are alive), then turn them off
            for (var i = 0; i < poolArr.length; i++) {
                var entity = poolArr[i];
                if (entity.inUse) {
                    entity.inUse = false;
                }
            }
        },

        /********************************************************
        * moveArrElement
        * Shifts items in the array
        ********************************************************/
        moveArrElement: function (array, old_index, new_index) {
            if (new_index >= array.length) {
                var k = new_index - array.length;
                while ((k--) + 1) {
                    array.push(undefined);
                }
            }
            array.splice(new_index, 0, array.splice(old_index, 1)[0]);
            return array;
        }
    });
});