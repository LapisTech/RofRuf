
class User
{
	private db: DB;

	constructor( db:DB )
	{
		this.db = db;
	}

	public getRuf(): Ruf|null { return this.db.getRuf(); }

	public getItems()
	{
		return this.db.getItems().then( ( items ) => { return Item.convert( items ); } );
	}
}
