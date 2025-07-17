import morphdom from '../vendor/morphdom.js';

const templateMap = {};

class DOMUtil {

	static createElement(html){
		const doc = document.createElement('div');
		doc.innerHTML = html;
		return doc.firstChild;
	}

	static getTemplate(templateName){
		return templateMap[templateName] || (templateMap[templateName] = document.querySelector(`template[data-name="${templateName}"]`).innerHTML);
	}

	static generateNode(template, data, $parent){
		const html = DOMUtil.generateHTML(template, data);
		const $child = DOMUtil.createElement(html);
		$parent && $parent.appendChild($child);
		return $child;
	}

	static updateNode($node, template, data){
		const html = DOMUtil.generateHTML(template, data);
		morphdom($node, html);
		return $node;
	}

	static updateChidlrenByTemplate($parent, dataList, templateName){
		const children = [...$parent.children];
		const len = Math.max(children.length, dataList.length);

		for(let i=0; i < len; i++){
			const data = dataList[i];
			const child = children[i];
			if(data) {
				if(child) {
					DOMUtil.updateNode(child, templateName, data);
				} else {
					DOMUtil.generateNode(templateName, data, $parent);
				}
			} else if(child) {
				child.remove();
			}
		}
	}

	static generateHTML(template, data){
		return DOMUtil
		.getTemplate(template)
		.trim()
		.replaceAll(/[\t\n]+/g, '')
		.replaceAll(/\s+/g, ' ')
		.replaceAll(/{{\s*(\w+)\s*}}/ig, (piece, prop)=>{
			return (prop in data) ? data[prop] : '';
		});
	}

}

export default DOMUtil;
