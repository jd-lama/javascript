document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#email-detail-view').style.display = 'none';
  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function view_email(id){
  fetch(`/emails/${id}`)
.then(response => response.json())
.then(email => {
    // Print email
    console.log(email);
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#email-detail-view').style.display = 'block';
    
    document.querySelector('#email-detail.-view').innerHTML = `
    <ul class="list-group">
      <li class="list-group-item">From : ${email.sender}</li>
      <li class="list-group-item">From : ${email.recipients}</li>
      <li class="list-group-item">From : ${email.subject}</li>
      <li class="list-group-item">From : ${email.timestamp}</li>
      <li class="list-group-item">From : ${email.body}</li>
    </ul>
    `

    if (!email.read){
      fetch(`/emails/${email.id}`, {
        method: 'PUT',
        body: JSON.stringify({
            read: true
        })
      })
    }
    //archiev
    const btn_arch = document.createElement('button');
    btn_arch.innerHTML = email.archived ? "Unarchived": "Archived";
    btn_arch.className = email.archived ? "btn btn-success" : "btn btn-danger";
    btn_arch.addEventListener('click',function(){
      fetch(`/emails/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            archived: !email.archived
        })
      })
      .then(()=>{load_mailbox('archive')})
    })
    document.querySelector('#email-detail-view').append(btn_arch)

    //reply
    const btn_reply = document.createElement('button');
    btn_arch.innerHTML = "Reply"
    btn_arch.className = "btn btn-info";
    btn_reply.addEventListener('click',function(){
      compose_email();

      document.querySelector('#compose-recipients').value = email.sender;
      document.querySelector('#compose-subject').value = '';
      document.querySelector('#compose-body').value = `On ${email.timestamp} ${email.sender} wrote:${email.body}`;
    }) 
    document.querySelector('#email-detail-view').append(btn_reply)
});

}



function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-detail-view').style.display = 'none';
  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch(`/emails/${mailbox}`)
.then(response => response.json())
.then(emails => {
    emails.forEach(singleEmail =>{
      console.log(singleEmail);

      const newEmail = document.createElement('div');
      newEmail.className = "list-group-item";
      newEmail.innerHTML = `
          <h5> Sender: ${singleEmail.sender}</h5>
          <h4> Subject:${singleEmail.subject}</h4>
          <p>${singleEmail.timestamp}</p>
      `;
      newEmail.className = singleEmail.read ? 'read':'unread';
      newEmail.addEventListener('click',function(){
        view_email(singleEmail.id)
      });
      document.querySelector('#emails-view').append(newEmail);
    })
});
}

function send_email(e){
  e.preventDefault()
  const recipients = document.querySelector('#compose-recipents').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;


  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: body
    })
  })
  .then(response => response.json())
  .then(result => {
      // Print result
      console.log(result);
  });
  
}