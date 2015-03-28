import org.voltdb.*;

public class SetUser extends VoltProcedure {

  public final SQLStmt findCurrent = new SQLStmt(
      "SELECT UserID, GameID, ActorID, AppID FROM UserGame WHERE UserID = ? AND GameID = ? AND AppID = ?");
  public final SQLStmt updateExisting = new SQLStmt(
      " UPDATE UserGame SET ActorID=?"
    + " WHERE UserID=? AND GameID=? AND AppID=?;");
  public final SQLStmt addNew = new SQLStmt(
      " INSERT INTO UserGame (UserID, GameID, ActorID, AppID) VALUES (?,?,?,?);");

  public VoltTable[] run(String userID,
                         String gameID,
                         String actorID,
                         String appID)
      throws VoltAbortException {

          voltQueueSQL( findCurrent, userID, gameID,appID );
          VoltTable[] results = voltExecuteSQL();

          if (results[0].getRowCount() > 0) { // found a record
             voltQueueSQL( updateExisting, actorID,
                                           userID,
                                           gameID,
                                           appID );

          } else {  // no existing record
             voltQueueSQL( addNew, userID,
                                   gameID,
                                   actorID,
                                   appID);

          }
          return voltExecuteSQL();
      }
}
