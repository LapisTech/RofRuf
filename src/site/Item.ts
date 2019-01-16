enum ItemType
{
	Unknown,
	Item,
	Food,
}

interface ItemData
{
	id: number,
	type: ItemType,
	text: string,
}

interface UserItem
{
	id: number,
	count: number,
}

interface ItemFullData extends ItemData, UserItem {}

class Item
{
	private static items: ItemData[] = [];

	public static init()
	{
		this.items[ 0 ] = { id: 0, type: ItemType.Unknown, text: '' };
	}

	public static convert( items: UserItem[] )
	{
		return items.map( ( item ) => { return <ItemFullData>Object.assign( {}, item, this.find( item ) ); } );
	}

	public static find( item: UserItem|number )
	{
		const id = typeof item === 'number' ? item : item.id;
		for ( let i = 1 ; i < this.length ; ++i )
		{
			if ( this.items[ i ].id === id ) { return Object.assign( {}, this.items[ i ] ); }
		}
		return Object.assign( {}, this.items[ 0 ] );
	}

	public static getAll()
	{
		return this.items.map( ( item ) => { return Object.assign( {}, item ) } );
	}
}
