
class User
{
	constructor()
	{
	}

	public getRuf(): Ruf|null { return null; }

	public getItems(): ItemData[]
	{
const items: ItemData[] = [ { type: ItemType.Food }, { type: ItemType.Item }, { type: ItemType.Food }, { type: ItemType.Item }, { type: ItemType.Item } ];

		return items;
	}
}
