$(document).ready(()=>{
    const socket = io.connect();
    const name = $('#nicname');
    const add_user = $('.add_user');
    const users = $('.users');
    const authorization = $('.authorization');
    const input_user = $('.input_user');
    const list_user = $('#list_user');
    const right =  $('.right');
    const left = $('.left');
    const container = $('.registration');
    const message = $('.message');
    const input_message = $("#input_message");
    const ul_1 = $('#ul_1');
    const users_list = $('.users_list')
    let this_user

    add_user.on('click',(e)=>{
        socket.emit('login',name.val())
        this_user = name.val();
    })

    message.on('click',(e)=>{
        socket.emit('message',input_message.val())
        input_message.val('')
    })

    socket.on('login',(data)=>{
        if(data.status === "OK"){
            container.removeClass('registration')
            left.removeClass('registration_l')
            right.removeClass('registration_r')
            list_user.text('Список участников')
            authorization.addClass('d_none')
            users.removeClass('d_none');
            input_user.removeClass('d_none')
        }
    })

    socket.on('new message',(data)=>{
        let time_valid = data.time.substring(0,19);
        String.prototype.replaceAt = function(index, replacement) {
            if (index >= this.length) {
                return this.valueOf();
            }
         
            return this.substring(0, index) + replacement + this.substring(index + 1);
        }
        time_valid = time_valid.replaceAt(10, ' ');
        let newMsg;
        if(data.nick === this_user){
            newMsg = 
            `<li class = "li_my">
                <div class="user_elem my_message">
                    <div class="text_user">${data.message}</div>
                    <div class="time">${time_valid}</div>
                </div>
                <div class="tail"></div>
                <div class="tail_2"></div>
            </li>`
        }
        else{
            newMsg = 
            `<li class = "li_other">
                <div class="user_elem other_message">
                    <div class="fio">${data.nick}</div>
                    <div class="text_user">${data.message}</div>
                    <div class="time">${time_valid}</div>
                </div>
                <div class="tail_3"></div>
                <div class="tail_4"></div>
            </li>`
        }
        ul_1.append(newMsg);


    })

    socket.on('users_arr',(data)=>{
        $('.users_list li').remove();
        for (let index = 0; index < data.users_arr.length; index++) {
            if(data.users_arr[index] === this_user){
                users_list.append(`<li class = "li_2 this_user">${data.users_arr[index]} - Вы</li>`);
            }
            else{
                users_list.append(`<li class = "li_2">${data.users_arr[index]} - другой пользователь</li>`);
            }
        }
    })
})