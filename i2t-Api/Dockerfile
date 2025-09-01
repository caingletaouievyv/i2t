# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY i2t-Api/*.csproj ./ 
RUN dotnet restore "i2t-Api.csproj"

# Copy everything else and build
COPY i2t-Api/. ./ 
RUN dotnet publish "i2t-Api.csproj" -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Copy published app
COPY --from=build /app/publish .

# Explicitly copy tessdata + dictionaries (important for Tesseract!)
COPY i2t-Api/tessdata ./tessdata
COPY i2t-Api/Dictionaries ./Dictionaries

ENTRYPOINT ["dotnet", "i2t-Api.dll"]
