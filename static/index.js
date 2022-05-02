$(document).ready(function () {
    // let base_url = 'https://shopify-developer-challenge.harlliey.repl.co';
    let base_url = 'http://127.0.0.1:5000';

    $('#showDeletion').click(function () {
        let c = $('#showDeletion').prop('checked');
        if (c) {
            $.get(base_url + '/query_deleted_inventories', function (data, status) {
                if (status === 'success' && data['status'] === 200) {
                    let inv_list = data['data'];
                    let it_selector = $('#InventoryTable tbody');
                    it_selector.html('');
                    for (let i = 0; i < inv_list.length; i++) {
                        let html = "<tr><td>" + inv_list[i].id + "</td><td>" + inv_list[i].name + "</td><td>" + inv_list[i].count + "</td><td>" + inv_list[i].inv_id + "</td><td>" + inv_list[i].staff + "</td><td>" + inv_list[i].description + "</td><td>" + inv_list[i].country + "</td><td>" + inv_list[i].region + "</td>";
                        html += "<td><button type=\"button\" class=\"btn btn-warning btn-recover btn-sm mr-3 \">Undo</button><button type=\"button\" class=\"btn btn-info btn-comments btn-sm \" data-toggle=\"modal\" data-target=\"#commentsModal\">Comments</button></td><td style=\"display:none;\">" + inv_list[i].comments + "</td></tr>"
                        it_selector.append(html);
                    }

                    $('table tbody .btn-comments').click(function () {
                        let comments = $(this).closest('tr').find('td:eq(9)').text();
                        if (comments === '') {
                            comments = 'No comments for this inventory!'
                        }
                        $('#commentsModal .modal-body p').text(comments);
                    });

                    $('table tbody .btn-recover').click(function () {
                        let id = $(this).closest('tr').find('td:eq(0)').text();
                        $.get(base_url + '/recover_deletion/' + id, function (data, status) {
                            if (status === 'success' && data['status'] === 200) {
                                sessionStorage.setItem("deleteChecked", "true");
                                window.location.reload();
                            } else {
                                $('#hint').text(data['data']);
                                $('#hint').fadeIn();
                            }
                        });
                    });

                } else {
                    alert("server error!")
                }
            });
        } else {
            window.location.reload();
        }
    });

    let deleteChecked = sessionStorage.getItem('deleteChecked');
    if (deleteChecked) {
        sessionStorage.removeItem('deleteChecked');
        $('#showDeletion').prop('checked', true);
    }
    if ($('#showDeletion').prop('checked')) {
        $.get(base_url + '/query_deleted_inventories', function (data, status) {
            if (status === 'success' && data['status'] === 200) {
                let inv_list = data['data'];
                let it_selector = $('#InventoryTable tbody');
                it_selector.html('');
                for (let i = 0; i < inv_list.length; i++) {
                    let html = "<tr><td>" + inv_list[i].id + "</td><td>" + inv_list[i].name + "</td><td>" + inv_list[i].count + "</td><td>" + inv_list[i].inv_id + "</td><td>" + inv_list[i].staff + "</td><td>" + inv_list[i].description + "</td><td>" + inv_list[i].country + "</td><td>" + inv_list[i].region + "</td>";
                    html += "<td><button type=\"button\" class=\"btn btn-warning btn-recover btn-sm mr-3 \">Undo</button><button type=\"button\" class=\"btn btn-info btn-comments btn-sm \" data-toggle=\"modal\" data-target=\"#commentsModal\">Comments</button></td><td style=\"display:none;\">" + inv_list[i].comments + "</td></tr>"
                    it_selector.append(html);
                }

                $('table tbody .btn-comments').click(function () {
                    let comments = $(this).closest('tr').find('td:eq(9)').text();
                    $('#commentsModal .modal-body p').text(comments);
                });

                $('table tbody .btn-recover').click(function () {
                    let id = $(this).closest('tr').find('td:eq(0)').text();
                    $.get(base_url + '/recover_deletion/' + id, function (data, status) {
                        if (status === 'success' && data['status'] === 200) {
                            sessionStorage.setItem("deleteChecked", "true");
                            window.location.reload();
                        } else {
                            $('#hint').text(data['data']);
                            $('#hint').fadeIn();
                        }
                    });
                });
            } else {
                alert("server error!");
            }
        });
    } else {
        $.get(base_url + '/query_inventories', function (data, status) {
            if (status === 'success' && data['status'] === 200) {
                let inv_list = data['data'];
                let it_selector = $('#InventoryTable tbody');
                it_selector.html('');
                for (let i = 0; i < inv_list.length; i++) {
                    let html = "<tr><td>" + inv_list[i].id + "</td><td>" + inv_list[i].name + "</td><td>" + inv_list[i].count + "</td><td>" + inv_list[i].inv_id + "</td><td>" + inv_list[i].staff + "</td><td>" + inv_list[i].description + "</td><td>" + inv_list[i].country + "</td><td>" + inv_list[i].region + "</td>";
                    html += "<td><button type=\"button\" class=\"btn btn-primary btn-edit btn-sm mr-3\">Edit</button><button type=\"button\" class=\"btn btn-danger btn-delete btn-sm \" data-toggle=\"modal\" data-target=\"#deleteModal\">Delete</button></td></tr>"
                    it_selector.append(html);
                }

                $('table tbody .btn-delete').click(function () {
                    let id = $(this).closest('tr').find('td:eq(0)').text();
                    $("#btn-modal-confirm").click(function () {
                        let comments = $("#Comments").val();
                        $.post(base_url + '/delete_inventory',
                            {
                                id: id,
                                comments: comments
                            },
                            function (data, status) {
                                if (data['status'] === 200) {

                                    sessionStorage.setItem("deleteSuc", "true");
                                    window.location.reload();

                                } else {
                                    $('#hint').text(data['data']);
                                    $('#hint').fadeIn();
                                }
                            });
                    });
                });

                $('table tbody .btn-edit').click(function () {
                    $(this).closest('tr').children().each(function () {
                        let i = parseInt($(this).index());
                        if (i > 0 && i < 6) {
                            let value = $(this).text();
                            if (i === 2 || i === 3) {
                                $(this).html("<input type=\"number\" class=\"form-control\">");
                                $(this).find('input').val(value);
                            } else if (i === 4) {
                                $(this).html("<select class=\"form-control\"><option disabled selected hidden>Choose...</option><option>Peter</option><option>Jack</option><option>Wilson</option></select>");
                                $(this).find('select').val(value);
                            } else {
                                $(this).html("<input type=\"text\" class=\"form-control\">");
                                $(this).find('input').val(value);
                            }
                        } else if (i === 8) {
                            $(this).html("<button type=\"button\" class=\"btn btn-success btn-finish btn-sm mr-3\">Finish</button><button type=\"button\" class=\"btn btn-secondary btn-cancel btn-sm\">Cancel</button>");
                            $(this).find('.btn-cancel').click(function () {
                                window.location.reload();
                            });
                            $(this).find('.btn-finish').click(function () {
                                let postList = [];
                                $(this).parent().parent().children().each(function () {
                                    let value = 0;
                                    let j = parseInt($(this).index());
                                    if (j > 0 && j < 6) {
                                        if (j === 4) {
                                            value = $(this).find('select').val();
                                        } else {
                                            value = $(this).find('input').val();
                                        }
                                    } else {
                                        value = $(this).text();
                                    }
                                    postList.push(value);
                                });

                                if (postList[1] === '' || postList[2] === '' || postList[3] === '' || postList[4] === null) {
                                    $('#up-hint').text("Missing required fields!");
                                    $('#up-hint').fadeIn();
                                } else {
                                    $.post(base_url + '/update_inventory',
                                        {
                                            id: postList[0],
                                            name: postList[1],
                                            count: postList[2],
                                            inv_id: postList[3],
                                            staff: postList[4],
                                            desc: postList[5]
                                        },
                                        function (data, status) {
                                            if (data['status'] === 200) {

                                                sessionStorage.setItem("updateSuc", "true");
                                                window.location.reload();

                                            } else {
                                                $('#hint').text(data['data']);
                                                $('#hint').fadeIn();
                                            }
                                        });
                                }
                            });
                        }
                    });
                });
            } else {
                alert("server error!")
            }
        });
    }

    let createSuc = sessionStorage.getItem('createSuc');
    if (createSuc) {
        sessionStorage.removeItem('createSuc');
        $('#success').prepend("Successfully create an inventory record!");
        $('#success').fadeIn();
        $('#success').fadeOut(5000);
    }

    let updateSuc = sessionStorage.getItem('updateSuc');
    if (updateSuc) {
        sessionStorage.removeItem('updateSuc');
        $('#success').prepend("Successfully update an inventory record!");
        $('#success').fadeIn();
        $('#success').fadeOut(5000);
    }

    let deleteSuc = sessionStorage.getItem('deleteSuc');
    if (deleteSuc) {
        sessionStorage.removeItem('deleteSuc');
        $('#success').prepend("Successfully delete an inventory record!");
        $('#success').fadeIn();
        $('#success').fadeOut(5000);
    }

    $("#submitBtn").click(function () {
        let name = $("#InventoryName").val();
        let count = $("#InventoryCount").val();
        let id = $("#InventoryId").val();
        let desc = $("#Description").val();
        let staff = $("#StaffInCharge").val();
        let country = $("#Country").val();
        let region = $("#gds-cr-one").val();

        if (name === '' || count === '' || id === '' || staff === null || country === '' || region === '') {
            $('#hint').text("All the fields with * are required fields!");
            $('#hint').fadeIn();
            // $('#hint').fadeOut(5000);
            $("#InventoryName").val(name);
            $("#InventoryCount").val(count);
            $("#InventoryId").val(id);
            $("#Description").val(desc);
            $("#StaffInCharge").val(staff);
            $("#Country").val(country);
            $("#gds-cr-one").val(region);
        } else {
            $('#hint').fadeOut();
            $.post(base_url + '/create_inventory',
                {
                    name: name,
                    count: count,
                    id: id,
                    staff: staff,
                    desc: desc,
                    country: country,
                    region: region
                },
                function (data, status) {
                    if (data['status'] === 200) {

                        sessionStorage.setItem("createSuc", "true");
                        window.location.reload();

                    } else {
                        $('#hint').text(data['data']);
                        $('#hint').fadeIn();
                    }
                });
        }
    });
});