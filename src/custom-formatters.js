'use strict';

const EOL = require('os').EOL;
const utils = require('./utils');

module.exports = {
	table2(chunk) {
			let lines = [this.formatters.ruler('')];
			lines.push([
				utils.pad('Kol', ' ', 6, utils.PAD_RIGHT),
				utils.pad('Proizvod', ' ', this.config.width - 18, utils.PAD_RIGHT),
				utils.pad('Ukupno', ' ', 12, utils.PAD_LEFT)
			].join(''));
		
				lines.push(this.formatters.ruler(''));
		
				for (let line of chunk.lines) {
					let total = line.qty * line.cost;
		
					if (line.hasOwnProperty('discount')) {
						if (line.discount.type === 'percentage') total *= (1 - line.discount.value);
						else total -= line.discount.value;
					}
		
					lines.push([
						utils.pad(line.qty, ' ', 6, utils.PAD_RIGHT),
						utils.pad(line.item.substr(0, this.config.width - 18), ' ', this.config.width - 18, utils.PAD_RIGHT),
						utils.pad(utils.money(total), ' ', 12, utils.PAD_LEFT)
					].join(''));
		
					if (line.hasOwnProperty('discount')) {
						let discountText =  line.discount.hasOwnProperty('message')
							? '  (' + line.discount.message + ')'
							: '  (Item Disc. -' + (line.discount.type === 'percentage' ? (line.discount.value * 100) + '%' : this.config.currency + utils.money(line.discount.value)) + ')';
		
						lines.push([
							utils.pad('', ' ', 6, utils.PAD_RIGHT),
							discountText
						].join(''));
					}
				}
		
				lines.push(this.formatters.ruler(''));
		
				return lines.join(EOL);
	},
	table3(chunk){
  // line.capita     - osnovna cijena proizvoda
  // line.quantity   - količina proizvoda 
  // line.cumulative - ukupna cijena proizvoda
  let lines = [this.formatters.ruler('')];
  // acc - alternate currency coefficient
  let acc  = 7.543501
  lines.push([
    utils.pad('Kol', ' ', 6, utils.PAD_RIGHT),
	utils.pad('Proizvod', ' ', this.config.width - 22, utils.PAD_RIGHT),
	utils.pad('HRK', ' ', 9, utils.PAD_LEFT),
    utils.pad('EUR', ' ', 7, utils.PAD_LEFT)
  ].join(''));
  
  lines.push(this.formatters.ruler(''));
  
  for (let line of chunk.lines) {
    /* let total = line.qty * line.cost;
    if (line.hasOwnProperty('discount')) {
        if (line.discount.type === 'percentage') total *= (1 - line.discount.value);
        else total -= line.discount.value;
    } */

    lines.push([
        utils.pad(line.quantity, ' ', 6, utils.PAD_RIGHT),
        utils.pad(line.item.substr(0, this.config.width - 22), ' ', this.config.width - 22, utils.PAD_RIGHT),
        /* utils.pad(utils.money(line.cumulative), ' ', 12, utils.PAD_LEFT) */
        utils.pad(line.cumulative, ' ', 9, utils.PAD_LEFT),
        utils.pad(utils.money(line.cumulative / acc), ' ', 7, utils.PAD_LEFT)
    ].join(''));
    
    if (line.hasOwnProperty('discount')) {
        let discountText =  line.discount.hasOwnProperty('message')
            ? '  (' + line.discount.message + ')'
            : '  (Item Disc. -' + (line.discount.type === 'percentage' ? (line.discount.value * 100) + '%' : this.config.currency + utils.money(line.discount.value)) + ')';

            lines.push([
                utils.pad('', ' ', 6, utils.PAD_RIGHT),
                discountText
            ].join(''));
        }
    }

    lines.push(this.formatters.ruler(''));
    return lines.join(EOL);

},
	taxes(chunk) {
		let lines = [this.formatters.ruler('')];

		lines.push([
			utils.pad('Porez', ' ', 10, utils.PAD_RIGHT),
			utils.pad('Osnovica', ' ', this.config.width - 22, utils.PAD_RIGHT),
			utils.pad('Iznos', ' ', 12, utils.PAD_LEFT)
		].join(''));
			lines.push(this.formatters.ruler(''));
			for (let line of chunk.lines) {
				lines.push([
					utils.pad(line.item, ' ', 10, utils.PAD_RIGHT),
					utils.pad(utils.money(line.basis), ' ', this.config.width - 22, utils.PAD_RIGHT),
					utils.pad(utils.money(line.amount), ' ', 12, utils.PAD_LEFT)
				].join(''));
			}
			lines.push(this.formatters.ruler(''));
			return lines.join(EOL);
	},
	fiskal(chunk) {
		let widest = 0;
		for (let line of chunk.lines) {
			widest = Math.max(line.name.length, widest);
		}
		return chunk.lines.map((line) => utils.pad(line.name + '', ' ', widest + 1) + line.value).join(EOL);
	}
};