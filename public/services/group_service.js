app.factory('groupService', function ($http) {

    return {
        
        getAllGroups: function () { // OK
            return $http.get('/api/getAllGroups');

        },

        postNewGroup: function (group) { // TODO
            return $http({
                method:'POST',
                url:'/api/setNewGroup',
                headers: {'Content-Type' : 'application/json'},
                data: { 
                    groupName : group.name,
                    country : group.country,
                    city : group.city,
                    adminName: group.admin_name,
                    adminId: group.admin_id,
                    days: group.days

                }
            });
        },

        // test
        getUsersByGroupId: function (id) { // TODO
            return $http({
                method:'POST',
                url:'/api/getUsersByGroupId',
                headers: {'Content-Type' : 'application/json'},
                data: { 
                    groupID: id

                }
            });
        }

    }
});