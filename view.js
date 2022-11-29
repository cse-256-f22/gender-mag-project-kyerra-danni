// ---- Define your dialogs  and panels here ----
var files = [];
let side_title = document.createElement('h3');
let side_title2 = document.createElement('h4');
let title_text = document.createTextNode('If you are not sure if your changes applied or if some checked permission is truly effective, you can always check up-to-date effective permissions here:');
let example_text = document.createTextNode("e.g. Some of the Teaching Assistant's checked permissions are not truly effective as shown in the edit window.");
side_title.append(title_text)
side_title2.append(example_text)
side_title2.className += "about";
$('#sidepanel').append(side_title)
$('#sidepanel').append(side_title2)

// for select file
let file_p = document.createElement('p');
let file_text = document.createTextNode("1. Select a file or a folder.");
file_p.append(file_text)
$('#sidepanel').append(file_p)


var form = document.createElement("form");
var select_list = document.createElement("select");
select_list.id = 'select_file'
form.appendChild(select_list);
$('#sidepanel').append(form);
        
// for select user
side_title = document.createElement('p');
title_text = document.createTextNode('2. Select a user');
side_title2 = document.createElement('p');
title_text2 = document.createTextNode('* important: If you select another folder after selecting user, please reselect the user.');
side_title.append(title_text)
side_title2.append(title_text2)
side_title2.id = 'notice'
$('#sidepanel').append(side_title)
// $('#sidepanel').append(side_title2)

let add_div = document.createElement('div');
$('#sidepanel').append(add_div);
add_div.id = 'add_div'
let new_per = define_new_effective_permissions('permission', true, null)
document.getElementById("select_file").onchange = function() {
    console.log("change")
    $("#add_div").empty();
    let new_select = define_new_user_select_field('permission', 'Select user', on_user_change = function(selected_user){
        $('#permission').attr('username', selected_user)
        $('#permission').attr('filepath', document.getElementById("select_file").value)
        
    })
    console.log( $('#sidepanel'))
    $('#add_div').append(new_select)
    
}
//$('#P_field').attr('username', 'administrator')


    
// for info panel
let panel_info = document.createElement('p');
let info_text = document.createTextNode("3. Allowed permissions has a check mark (✓) in front of it. Click the icon to check full explanation of the permission.");
panel_info.append(info_text)
$('#sidepanel').append(panel_info)
$('#sidepanel').append(new_per)


// for instruction
side_title = document.createElement('h3');
title_text = document.createTextNode('Quick notes:');
side_title.append(title_text)
$('#sidepanel').append(side_title)
about_changeable = $('<div class="about"><b>Changeable permissions</b> are any permissions except for <b>reading</b>. </div>')
about_save = $('<div class="about">Always click <b>OK</b> when you want to save your changes. </div>')
$('#sidepanel').append(about_changeable)
$('#sidepanel').append(about_save)

// ---- Display file structure ----
let dialog = define_new_dialog("dialog", 'Permission Information', options = {});
// let new_dia = define_new_dialog('P')
//$('#permission').attr('filepath')
$('.perm_info').click(function(e){
    $("#dialog").empty();
    $("#dialog").dialog("open");
    // stuff that should happen on click goes here
    let path = $('#permission').attr('filepath')
    let file_obj = path_to_file[path]
    let user = $('#permission').attr('username')
    let user_obj = all_users[user]
    if (!$('#permission').attr('username') || !$('#permission').attr('filepath')) {
        if (!$('#permission').attr('username')) {
            $("#dialog").append("Error: Please select a user.")
        } else {
            $("#dialog").append("Error: Please select a file.")
        }
    }
    let permission = $(this).attr('permission_name')
    let explain = allow_user_action(file_obj, user_obj, permission, true)
    let result = get_explanation_text(explain);
    // let result_p = document.createElement('p');
    // let result_text = document.createTextNode(result);
    // result_p.append(result_text)
    // $('#sidepanel').append(result)
    console.log(result)
    $("#dialog").append(result);
    
})

// function make_option(file) {
//     let file_hash = get_full_path(file);
//     var option = document.createElement("option");
//     option.value = file_hash;
//     option.innerHTML = file_hash;
//     if( file_hash in parent_to_children) {
//         for(child_file of parent_to_children[file_hash]) {
//             let child_elem = make_option(file)
//         }
//     }
//     return option;
// }



// (recursively) makes and returns an html element (wrapped in a jquery object) for a given file object
function make_file_element(file_obj) {
    let file_hash = get_full_path(file_obj)
    console.log(file_hash)
    files.push(get_full_path(file_obj))
    console.log(files)
    if(file_obj.is_folder) {
        let folder_elem = $(`<div class='folder' id="${file_hash}_div">
            <h3 id="${file_hash}_header">
                <span class="oi oi-folder" id="${file_hash}_icon"/> ${file_obj.filename} 
                <button class="ui-button ui-widget ui-corner-all permbutton" path="${file_hash}" id="${file_hash}_permbutton"> 
                    <span class="oi oi-lock-unlocked" id="${file_hash}_permicon"/> 
                    Edit Permissions
                </button>
            </h3>
        </div>`)

        // append children, if any:
        if( file_hash in parent_to_children) {
            let container_elem = $("<div class='folder_contents'></div>")
            folder_elem.append(container_elem)
            for(child_file of parent_to_children[file_hash]) {
                let child_elem = make_file_element(child_file)
                container_elem.append(child_elem)
                
            }
        }
        return folder_elem
    }
    else {
        return $(`<div class='file'  id="${file_hash}_div">
            <span class="oi oi-file" id="${file_hash}_icon"/> ${file_obj.filename}
            <button class="ui-button ui-widget ui-corner-all permbutton" path="${file_hash}" id="${file_hash}_permbutton"> 
                <span class="oi oi-lock-unlocked" id="${file_hash}_permicon"/> 
                Edit Permissions
            </button>
        </div>`)
    }
}

for(let root_file of root_files) {
    let file_elem = make_file_element(root_file)
    $( "#filestructure" ).append( file_elem);    
}

files.forEach((file, i)=> {
    console.log(files[i])
    var option = document.createElement("option");
    option.value = file;
    option.innerHTML = file;
    select_list.appendChild(option)
})



// make folder hierarchy into an accordion structure
$('.folder').accordion({
    collapsible: true,
    heightStyle: 'content'
}) // TODO: start collapsed and check whether read permission exists before expanding?


// -- Connect File Structure lock buttons to the permission dialog --

// open permissions dialog when a permission button is clicked
$('.permbutton').click( function( e ) {
    // Set the path and open dialog:
    let path = e.currentTarget.getAttribute('path');
    perm_dialog.attr('filepath', path)
    perm_dialog.dialog('open')
    //open_permissions_dialog(path)

    // Deal with the fact that folders try to collapse/expand when you click on their permissions button:
    e.stopPropagation() // don't propagate button click to element underneath it (e.g. folder accordion)
    // Emit a click for logging purposes:
    emitter.dispatchEvent(new CustomEvent('userEvent', { detail: new ClickEntry(ActionEnum.CLICK, (e.clientX + window.pageXOffset), (e.clientY + window.pageYOffset), e.target.id,new Date().getTime()) }))
});


// ---- Assign unique ids to everything that doesn't have an ID ----
$('#html-loc').find('*').uniqueId() 