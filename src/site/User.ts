
class User
{
	constructor()
	{
	}

	public getRuf(): Ruf|null { return null; }

	public getItems()
	{
		const items: UserItem[] = [ { id: 1, count: 1 } ];

		return Item.convert( items );
	}
}
