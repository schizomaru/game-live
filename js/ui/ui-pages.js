const pages = [
	'lives', 'games', 'words', 'tags', 'settings'
];
const hashList = pages.map((page)=>{
	return '#' + page;
});


function getHash(){
	const hash = location.hash;
	let selected = hashList.find((pageHash)=>{
		return pageHash === hash;
	});
	return selected || '#lives';
}

function update(){
	const selectedHash = getHash();
	hashList.forEach((pageHash)=>{
		const selected = pageHash === selectedHash;
		const $a = document.querySelector(`a[href="${pageHash}"]`);
		const $page = document.querySelector(pageHash);
		$a.classList.toggle('page-selected', selected);
		$page.classList.toggle('page-selected', selected);
	});
}

update();

window.addEventListener('hashchange', update);