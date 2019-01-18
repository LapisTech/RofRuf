interface RufData
{
	type: number,
	hp: number,
	birth: Date,
	dead: Date,
}

class Ruf
{
	private ruf: RufData;

	constructor( ruf: RufData )
	{
		this.ruf = ruf;
	}

	public isDead() { return this.ruf.hp <= 0; }
}
