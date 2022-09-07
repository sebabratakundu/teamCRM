$(document).ready(function () {
	$('[name=token]').val(token);

	getNotes();
	createPagination('note');
	const editor = new FroalaEditor('#editor', {
		height: 300
	});

	// $('.save-note-btn').on('click', function () {
	// 	$(this).parent().next().toggleClass('d-none');
	// });

	$('#note-form').on('submit', async function (e) {
		e.preventDefault();

		const formdata = new FormData(this);

		try {
			const response = await ajax({
				method: 'POST',
				url: '/note',
				data: formdata,
				loader_btn: '.save-note-loading-btn',
				submit_btn: '.save-note-btn'
			});
			this.reset();

			new sweetAlert({
				title : "Success",
				message : response.message,
				icon : "success",
				cnfBtnTxt : "Close"
			},"POST");

			if ($('.note-list .list-group-item').length < 5) {
				noteBlock = getListItem(response.data);
				$('.note-list').append(noteBlock);
			}

			createPagination('note');
		} catch (e) {
			const errors = e.responseJSON;
			console.log(errors);

			errors.forEach((error) => {
				$('.note-error').append($('<span></span>').text(error.message))
			});

			removeError('note', 3000);
		}
	});
});

async function getNotes(from = 0, to = 5) {
	let pageNumber = getPageNumber();
	if (pageNumber > 1) {
		from = to * (pageNumber - 1);
		to = to;
	}

	try {
		const response = await ajax({
			method: 'GET',
			url: `/note/${from}/${to}`,
			loader_btn: ".tmp",
			submit_btn: ".tmp"
		});


		localStorage.setItem('notes', JSON.stringify(response.data));
		createNoteList(response.data);
	} catch (e) {
		console.log(e);
	}
}

function createNoteList(notes) {
	const noteParentNode = $('.note-list');

	if (notes.length) {
		notes.forEach(note => {
			const noteListItem = getListItem(note);
			noteParentNode.append(noteListItem);
		});
	}
}

function getListItem(note) {
	const editIcon = $('<i class="fa fa-edit"></i>')
	const deleteIcon = $('<i class="fa fa-trash"></i>')
	const editButton = $(`<button></button>`)
		.addClass('btn icon-btn-warning float-right mr-1 edit-note')
		.attr('data-id', note._id)
		.append(editIcon);
	const deleteButton = $(`<button></button>`)
		.addClass('btn icon-btn-danger float-right ml-1 delete-note')
		.attr('data-id', note._id)
		.append(deleteIcon);
	const li = $('<li></li>')
		.addClass('list-group-item list-group-item-action')
		.text(note.noteName)
		.append(deleteButton)
		.append(editButton);

	return li;
}

$(document).on('click', '.edit-note', function () {
	const noteId = $(this).data('id');
	const notes = JSON.parse(localStorage.getItem('notes'));
	const currentNote = notes.find(note => note._id === noteId);
	console.log(currentNote.note);
	$('#editor').html(currentNote.note[0]);
});

$(document).on('click', '.delete-note', async function () {
	const noteId = $(this).data('id');

	const deleteNote = await new sweetAlert({
		title : "Are you sure",
		message : "You won't be able to revert this!",
		icon : "warning",
		cnfBtnTxt : "Yes, delete it!"
	},"DELETE")

	if (deleteNote.isConfirmed) {
		try {
			const response = await ajax({
				method: 'DELETE',
				url: `/note/${noteId}`,
				data : {token},
				submit_btn: '.tmp',
				loader_btn: '.tmp'
			})

			const noteAlart = await new sweetAlert({
				title : "Deleted!",
				message : response.message,
				icon : "success",
				cnfBtnTxt : "OK"
			},"");

			if (noteAlart.isConfirmed) {
				window.location = location.href;
			}

		} catch (e) {
			console.log(e);
		}
	}
})