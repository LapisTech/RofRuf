/// <reference path="./Ruf.ts" />

enum ItemType
{
	Item,
	Food,
}

interface Item
{
	type: ItemType,
}

class User
{
	constructor()
	{
	}

	public getRuf(): Ruf|null { return null; }

	public getItems(): Item[]
	{
		const items: Item[] = [];

		return items;
	}
}
