$(function(){
    var obj = {}, $tabs, $menu;
    $tabs = $("#tabs").tabs({
        onContextMenu: function(e, title, index){
            var $rightMenu = $("#rightMenu");
            if($rightMenu.length == 0){
                $rightMenu = $('<div id="rightMenu" style="width:120px;"></div>').appendTo("body").menu({
                    onClick: function(item){
                        if(item.id == "rightMenuRefresh"){
                            grunt.refreshTab();
                        }
                        else if(item.id =="rightMenuClose"){
                            grunt.closeTab();
                        }
                        else if(item.id == "rightMenuCloseAll"){
                            grunt.closeAllTab();
                        }
                    }
                });
                $rightMenu.menu("appendItem", {id: "rightMenuRefresh", text: "刷新",  iconCls: "icon-reload"});
                $rightMenu.menu('appendItem', {separator: true});
                $rightMenu.menu('appendItem', {id: "rightMenuClose", text: "关闭",  iconCls: "icon-clear"});
                $rightMenu.menu('appendItem', {id: "rightMenuCloseAll", text: "关闭全部",  iconCls: "icon-clear"});
            }
            $rightMenu.menu("show", {
                left: e.pageX,
                top: e.pageY
            });
            $tabs.tabs('select', index);
            e.preventDefault();
        }
    });
    $menu = $("#menu").tree({
        onClick: function(node){
            var name = node.text, icon = node.iconCls || '', href=node.attributes["href"];
            if(!$tabs.tabs('exists', name)){
                obj.addTab(name, icon, href);
            }
            else{
                $tabs.tabs('select', name);
            }
        }
    });
    obj.addTab = function(name, icon, url){
        if($tabs.tabs('getTab', name)){
            $tabs.tabs('select', name);
        }
        else{
            $tabs.tabs('add', {
                title : name,
                iconCls: 'tree-file ' + icon,
                content: "<iframe height='100%' width='100%' border ='0' frameBorder='0' scrolling='no' src='{url}' ></iframe>".replace("{url}", url),
                selected: true,
                closable: true,
                fit : true
            });
        }
    };
    obj.refreshTab = function(){
        var obj = $tabs.tabs('getSelected'), index;
        if(obj){
            index = $tabs.tabs('getTabIndex', obj);
            var tab = $tabs.tabs("getTab", index);
            var frame = tab.find("iframe");
            if(frame && frame.length > 0){
                frame.get(0).contentWindow.location.reload(true);
            }
        }
    };
    obj.closeTab = function(name){
        if(name){
            $tabs.tabs("close", name);
        }
        else{
            var tab = $tabs.tabs("getSelected");
            var index = $tabs.tabs("getTabIndex", tab);
            $tabs.tabs("close", index);
        }
    };
    obj.closeAllTab = function(){
        var tabs = $tabs.tabs("tabs");
        for(var i=tabs.length - 1; i>=0; i--){
            $tabs.tabs("close", i);
        }
    };
    window.grunt = obj;
});