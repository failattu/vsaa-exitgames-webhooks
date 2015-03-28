import org.voltdb.*;

public class SetGameState extends VoltProcedure {

  public final SQLStmt findCurrent = new SQLStmt(
      " SELECT AppID FROM GameState WHERE AppID=? AND GameID=?;");
  public final SQLStmt updateExisting = new SQLStmt(
      " UPDATE GameState SET JSONData=?"
    + " WHERE AppID=? AND GameID=?;");
  public final SQLStmt addNew = new SQLStmt(
      " INSERT INTO GameState (GameID, AppID, JSONData) VALUES (?,?,?);");

  public VoltTable[] run(String jsonData,
                         String gameID,
                         String appID)
      throws VoltAbortException {

          voltQueueSQL( findCurrent, appID, gameID );
          VoltTable[] results = voltExecuteSQL();

          if (results[0].getRowCount() > 0) { // found a record
             voltQueueSQL( updateExisting, jsonData,
                                           appID,
                                           gameID);

          } else {  // no existing record
             voltQueueSQL( addNew, gameID,
                                   appID,
                                   jsonData);

          }
          return voltExecuteSQL();
      }
}
