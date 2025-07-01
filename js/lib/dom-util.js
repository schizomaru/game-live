import morphdom from '../vendor/morphdom.js';

class DOMUtil {

	static createElement(html){
		const doc = document.createElement('div');
		doc.innerHTML = html;
		return doc.firstChild;
	}

	static updateChidlrenByTemplate($parent, dataList, templateName){
		const children = [...$parent.children];
		const len = Math.max(children.length, dataList.length);
		const template = document.querySelector(`template[data-name="${templateName}"]`).innerHTML;

		for(let i=0; i < len; i++){
			const data = dataList[i];
			const child = children[i];
			if(data) {
				const html = DOMUtil.generateHTML(template, data);
				if(child) {
					morphdom(child, html);	
				} else {
					$parent.appendChild(DOMUtil.createElement(html));
				}
			} else if(child) {
				child.remove();
			}
		}
	}

	static generateHTML(template, data){
		return template
		.trim()
		.replaceAll(/[\t\n]+/g, '')
		.replaceAll(/\s+/g, ' ')
		.replaceAll(/{{\s*(\w+)\s*}}/ig, (piece, prop)=>{
			return (prop in data) ? data[prop] : '';
		});
	}

}

export default DOMUtil;
